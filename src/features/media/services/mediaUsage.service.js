import { supabase } from "../../../services/supabase";

function normalize(value) {
  return String(value || "").trim();
}

function containsMediaReference(value, media) {
  if (value === null || value === undefined) return false;

  const serialized =
    typeof value === "string" ? value : JSON.stringify(value);

  const publicUrl = normalize(media?.publicUrl);
  const storagePath = normalize(media?.storagePath);

  return Boolean(
    (publicUrl && serialized.includes(publicUrl)) ||
      (storagePath && serialized.includes(storagePath)),
  );
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user.id;
}

async function queryTable(table, columns, userId) {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq("user_id", userId);

  if (error) {
    // A proteção não deve bloquear toda a biblioteca caso uma tabela opcional
    // ainda não exista em uma instalação antiga.
    if (
      error.code === "42P01" ||
      /does not exist|schema cache/i.test(error.message || "")
    ) {
      return [];
    }

    throw error;
  }

  return data || [];
}

export async function findMediaUsage(media) {
  if (!media?.publicUrl && !media?.storagePath) return [];

  const userId = await getCurrentUserId();

  const sources = [
    {
      table: "profiles",
      label: "Perfil",
      columns: "id,avatar_url,resume_url",
      fields: [
        ["avatar_url", "Avatar do perfil"],
        ["resume_url", "Currículo"],
      ],
    },
    {
      table: "portfolio_projects",
      label: "Projetos",
      columns: "id,title,image_url",
      fields: [["image_url", "Imagem de capa"]],
      getName: (row) => row.title,
    },
    {
      table: "portfolio_project_slides",
      label: "Slides de projetos",
      columns: "id,project_id,image_url,alt_text",
      fields: [["image_url", "Slide de projeto"]],
      getName: (row) => row.alt_text,
    },
    {
      table: "seo",
      label: "SEO",
      columns: "id,og_image,twitter_image,favicon_url",
      fields: [
        ["og_image", "Imagem Open Graph"],
        ["twitter_image", "Imagem do Twitter/X"],
        ["favicon_url", "Favicon"],
      ],
    },
    {
      table: "portfolio_themes",
      label: "Aparência",
      columns: "id,settings,custom_css",
      fields: [
        ["settings", "Tema ou fundo de seção"],
        ["custom_css", "CSS personalizado"],
      ],
    },
  ];

  const results = await Promise.all(
    sources.map(async (source) => {
      const rows = await queryTable(
        source.table,
        source.columns,
        userId,
      );

      return rows.flatMap((row) =>
        source.fields
          .filter(([field]) =>
            containsMediaReference(row[field], media),
          )
          .map(([field, fieldLabel]) => ({
            table: source.table,
            recordId: row.id,
            source: source.label,
            field,
            fieldLabel,
            recordName:
              source.getName?.(row) || fieldLabel,
          })),
      );
    }),
  );

  return results.flat();
}

export async function assertMediaCanBeDeleted(media) {
  const usages = await findMediaUsage(media);

  if (usages.length === 0) return [];

  const places = usages
    .slice(0, 4)
    .map(
      (usage) =>
        `${usage.source}: ${usage.recordName || usage.fieldLabel}`,
    )
    .join("; ");

  const remaining =
    usages.length > 4 ? ` e mais ${usages.length - 4}` : "";

  throw new Error(
    `Esta imagem está em uso e não pode ser excluída. Remova-a primeiro de: ${places}${remaining}.`,
  );
}
