import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../../services/supabase";

const SOURCE_TABLES = [
  { source: "profiles", target: "profiles", singleton: true },
  { source: "projects", target: "portfolio_projects" },
  { source: "project_slides", target: "portfolio_project_slides" },
  { source: "experiences", target: "experiences" },
  { source: "education", target: "education" },
  { source: "skills", target: "skills" },
  { source: "media", target: "media" },
  { source: "seo", target: "seo", singleton: true },
  { source: "portfolio_builder_settings", target: "portfolio_settings", singleton: true },
  { source: "portfolio_themes", target: "portfolio_themes", singleton: true },
  { source: "analytics_snapshots", target: "analytics_snapshots" },
];

const ALLOWED_COLUMNS = {
  profiles: ["id", "user_id", "is_public", "full_name", "professional_title", "short_bio", "bio", "location", "email", "phone", "github_url", "linkedin_url", "instagram_url", "youtube_url", "twitter_url", "website_url", "resume_url", "avatar_url", "available_for_work", "created_at", "updated_at"],
  portfolio_projects: ["id", "user_id", "title", "description", "category", "status", "featured", "github_url", "demo_url", "image_url", "created_at", "updated_at"],
  portfolio_project_slides: ["id", "project_id", "user_id", "image_url", "storage_path", "alt_text", "sort_order", "created_at", "updated_at"],
  experiences: ["id", "user_id", "position", "company", "employment_type", "location", "start_date", "end_date", "is_current", "description", "technologies", "company_url", "status", "featured", "created_at", "updated_at"],
  education: ["id", "user_id", "institution", "course", "degree", "field_of_study", "location", "description", "start_date", "end_date", "is_current", "is_featured", "is_published", "certificate_url", "display_order", "created_at", "updated_at"],
  skills: ["id", "user_id", "name", "category", "level", "description", "icon", "is_published", "is_featured", "display_order", "created_at", "updated_at"],
  media: ["id", "user_id", "name", "file_name", "public_url", "storage_path", "mime_type", "size", "width", "height", "alt_text", "created_at", "updated_at"],
  seo: ["id", "user_id", "site_name", "seo_title", "seo_description", "keywords", "canonical_url", "robots", "og_title", "og_description", "og_image", "twitter_title", "twitter_description", "twitter_image", "twitter_card", "favicon_url", "google_analytics", "google_tag_manager", "google_search_console", "bing_webmaster", "created_at", "updated_at"],
  portfolio_settings: ["id", "user_id", "sections", "hero_layout", "card_style", "button_style", "navbar_style", "container_width", "google_analytics_enabled", "google_analytics_measurement_id", "google_analytics_property_id", "google_analytics_last_sync_at", "google_analytics_last_error", "created_at", "updated_at"],
  portfolio_themes: ["id", "user_id", "theme_key", "mode", "primary_color", "secondary_color", "accent_color", "background_color", "surface_color", "text_color", "muted_text_color", "heading_font", "body_font", "border_radius", "custom_css", "settings", "created_at", "updated_at"],
  analytics_snapshots: ["id", "user_id", "provider", "period_start", "period_end", "payload", "created_at"],
};

function sanitizeUrl(value) {
  return value.trim().replace(/\/$/, "");
}

function pickAllowedColumns(row, target) {
  const allowed = new Set(ALLOWED_COLUMNS[target] ?? []);
  return Object.fromEntries(
    Object.entries(row).filter(([key, value]) => allowed.has(key) && value !== undefined),
  );
}

function transformRow(row, config, destinationUserId) {
  const transformed = {
    ...row,
    user_id: destinationUserId,
  };

  delete transformed.workspace_id;
  delete transformed.integration_id;
  delete transformed.project_id_legacy;

  if (config.singleton) {
    delete transformed.id;
  }

  return pickAllowedColumns(transformed, config.target);
}

async function getDestinationUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Faça login no Portfolio CMS antes de migrar.");
  return data.user;
}

export async function inspectLegacySource({ url, key, email, password }) {
  if (!url || !key || !email || !password) {
    throw new Error("Preencha URL, chave pública, e-mail e senha do Supabase antigo.");
  }

  const sourceClient = createClient(sanitizeUrl(url), key.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: signInError } = await sourceClient.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (signInError) throw signInError;

  const results = {};

  for (const config of SOURCE_TABLES) {
    const { data, error } = await sourceClient.from(config.source).select("*");

    if (error) {
      const missingTable = error.code === "42P01" || /does not exist|schema cache/i.test(error.message ?? "");
      if (missingTable) {
        results[config.target] = { ...config, rows: [], warning: `Tabela ${config.source} não encontrada.` };
        continue;
      }
      throw new Error(`${config.source}: ${error.message}`);
    }

    results[config.target] = { ...config, rows: data ?? [], warning: null };
  }

  await sourceClient.auth.signOut();
  return results;
}

async function migrateSingleton(target, rows, userId) {
  if (!rows.length) return 0;
  const payload = transformRow(rows[0], { target, singleton: true }, userId);
  const { error } = await supabase.from(target).upsert(payload, { onConflict: "user_id" });
  if (error) throw error;
  return 1;
}

async function migrateCollection(config, rows, userId) {
  if (!rows.length) return 0;
  const payload = rows.map((row) => transformRow(row, config, userId));
  const { error } = await supabase.from(config.target).upsert(payload, { onConflict: "id" });
  if (error) throw error;
  return payload.length;
}

export async function migrateLegacyData(inspection, selection = null, onProgress) {
  const destinationUser = await getDestinationUser();
  const summary = [];

  const selectedConfigs = selection ? SOURCE_TABLES.filter((config) => selection[config.target]) : SOURCE_TABLES;

  for (let index = 0; index < selectedConfigs.length; index += 1) {
    const config = selectedConfigs[index];
    const entry = inspection[config.target];
    const rows = entry?.rows ?? [];

    onProgress?.({
      index,
      total: selectedConfigs.length,
      table: config.target,
      status: "running",
    });

    try {
      const count = config.singleton
        ? await migrateSingleton(config.target, rows, destinationUser.id)
        : await migrateCollection(config, rows, destinationUser.id);

      summary.push({ table: config.target, count, status: "success" });
      onProgress?.({ index, total: selectedConfigs.length, table: config.target, status: "success", count });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      summary.push({ table: config.target, count: 0, status: "error", error: message });
      onProgress?.({ index, total: selectedConfigs.length, table: config.target, status: "error", error: message });
      throw new Error(`${config.target}: ${message}`, { cause: error });
    }
  }

  return summary;
}

export async function exportPortfolioBackup() {
  const user = await getDestinationUser();
  const backup = {
    schemaVersion: 1,
    app: "portfolio-cms",
    exportedAt: new Date().toISOString(),
    data: {},
  };

  for (const config of SOURCE_TABLES) {
    const { data, error } = await supabase
      .from(config.target)
      .select("*")
      .eq("user_id", user.id);

    if (error) throw new Error(`${config.target}: ${error.message}`);
    backup.data[config.target] = data ?? [];
  }

  return backup;
}

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function parseAndValidateBackup(text) {
  let backup;
  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error("O arquivo selecionado não contém um JSON válido.");
  }

  if (!backup || backup.schemaVersion !== 1 || backup.app !== "portfolio-cms" || !backup.data) {
    throw new Error("Arquivo de backup inválido ou incompatível com o Portfolio CMS.");
  }

  for (const config of SOURCE_TABLES) {
    const value = backup.data[config.target];
    if (value !== undefined && !Array.isArray(value)) {
      throw new Error(`A seção ${config.target} do backup está corrompida.`);
    }
  }

  return backup;
}

export async function importPortfolioBackup(backup, onProgress) {
  if (!backup || backup.schemaVersion !== 1 || !backup.data) {
    throw new Error("Arquivo de backup inválido ou incompatível.");
  }

  const inspection = Object.fromEntries(
    SOURCE_TABLES.map((config) => [
      config.target,
      { ...config, rows: Array.isArray(backup.data[config.target]) ? backup.data[config.target] : [] },
    ]),
  );

  return migrateLegacyData(inspection, null, onProgress);
}

export { SOURCE_TABLES };
