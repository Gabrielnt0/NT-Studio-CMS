import { supabase } from "../../../services/supabase";

export const DEFAULT_SECTIONS = Object.freeze([
  { id: "inicio", label: "Hero", enabled: true },
  { id: "sobre", label: "Sobre", enabled: true },
  { id: "trajetoria", label: "Experiências", enabled: true },
  { id: "formacao", label: "Formação", enabled: true },
  { id: "competencias", label: "Habilidades", enabled: true },
  { id: "projetos", label: "Projetos", enabled: true },
  { id: "curriculo", label: "Currículo", enabled: true },
  { id: "contato", label: "Contato", enabled: true },
]);

export const BUILDER_PRESETS = Object.freeze({
  modern: {
    label: "Moderno",
    heroLayout: "split",
    cardStyle: "rounded",
    buttonStyle: "rounded",
    navbarStyle: "blur",
    containerWidth: "wide",
    sectionSpacing: "comfortable",
    contentAlignment: "left",
    projectsColumns: 3,
    skillsLayout: "cards",
  },
  minimal: {
    label: "Minimalista",
    heroLayout: "centered",
    cardStyle: "flat",
    buttonStyle: "outline",
    navbarStyle: "transparent",
    containerWidth: "compact",
    sectionSpacing: "compact",
    contentAlignment: "center",
    projectsColumns: 2,
    skillsLayout: "list",
  },
  creative: {
    label: "Criativo",
    heroLayout: "fullscreen",
    cardStyle: "glass",
    buttonStyle: "pill",
    navbarStyle: "blur",
    containerWidth: "full",
    sectionSpacing: "spacious",
    contentAlignment: "left",
    projectsColumns: 3,
    skillsLayout: "cards",
  },
  timeline: {
    label: "Trajetória",
    heroLayout: "centered",
    cardStyle: "outline",
    buttonStyle: "rounded",
    navbarStyle: "solid",
    containerWidth: "wide",
    sectionSpacing: "comfortable",
    contentAlignment: "left",
    projectsColumns: 2,
    skillsLayout: "bars",
  },
});

export const DEFAULT_BUILDER_SETTINGS = Object.freeze({
  preset: "modern",
  sections: DEFAULT_SECTIONS,
  heroLayout: "split",
  showHeroAvatar: true,
  showResumeButton: true,
  showContactButton: true,
  showSocialLinks: true,
  cardStyle: "rounded",
  buttonStyle: "rounded",
  navbarStyle: "blur",
  containerWidth: "wide",
  sectionSpacing: "comfortable",
  contentAlignment: "left",
  projectsColumns: 3,
  projectsPerPage: 6,
  showProjectFilters: true,
  showProjectTechnologies: true,
  showProjectClient: true,
  showProjectDate: true,
  skillsLayout: "cards",
  groupSkillsByCategory: true,
  showFooterSocialLinks: true,
  showBackToTop: true,
  footerText: "",
});

const SELECT = `
  id, user_id, preset, sections, hero_layout, show_hero_avatar,
  show_resume_button, show_contact_button, show_social_links,
  card_style, button_style, navbar_style, container_width,
  section_spacing, content_alignment, projects_columns,
  projects_per_page, show_project_filters, show_project_technologies,
  show_project_client, show_project_date, skills_layout,
  group_skills_by_category, show_footer_social_links,
  show_back_to_top, footer_text, created_at, updated_at
`;

function cloneDefaultSections() {
  return DEFAULT_SECTIONS.map((item) => ({ ...item }));
}

function normalizeSections(value) {
  if (!Array.isArray(value)) return cloneDefaultSections();

  const stored = new Map(value.map((item) => [item?.id, item]));

  return DEFAULT_SECTIONS.map((fallback) => ({
    ...fallback,
    ...(stored.get(fallback.id) || {}),
    id: fallback.id,
    label: fallback.label,
    enabled: stored.get(fallback.id)?.enabled !== false,
  })).sort((first, second) => {
    const firstIndex = value.findIndex((item) => item?.id === first.id);
    const secondIndex = value.findIndex((item) => item?.id === second.id);
    return (firstIndex < 0 ? 999 : firstIndex) -
      (secondIndex < 0 ? 999 : secondIndex);
  });
}

function mapSettings(row) {
  if (!row) {
    return {
      ...DEFAULT_BUILDER_SETTINGS,
      sections: cloneDefaultSections(),
    };
  }

  return {
    id: row.id,
    userId: row.user_id,
    preset: row.preset || DEFAULT_BUILDER_SETTINGS.preset,
    sections: normalizeSections(row.sections),
    heroLayout: row.hero_layout || DEFAULT_BUILDER_SETTINGS.heroLayout,
    showHeroAvatar: row.show_hero_avatar !== false,
    showResumeButton: row.show_resume_button !== false,
    showContactButton: row.show_contact_button !== false,
    showSocialLinks: row.show_social_links !== false,
    cardStyle: row.card_style || DEFAULT_BUILDER_SETTINGS.cardStyle,
    buttonStyle: row.button_style || DEFAULT_BUILDER_SETTINGS.buttonStyle,
    navbarStyle: row.navbar_style || DEFAULT_BUILDER_SETTINGS.navbarStyle,
    containerWidth:
      row.container_width || DEFAULT_BUILDER_SETTINGS.containerWidth,
    sectionSpacing:
      row.section_spacing || DEFAULT_BUILDER_SETTINGS.sectionSpacing,
    contentAlignment:
      row.content_alignment || DEFAULT_BUILDER_SETTINGS.contentAlignment,
    projectsColumns:
      Number(row.projects_columns) || DEFAULT_BUILDER_SETTINGS.projectsColumns,
    projectsPerPage:
      Number(row.projects_per_page) ||
      DEFAULT_BUILDER_SETTINGS.projectsPerPage,
    showProjectFilters: row.show_project_filters !== false,
    showProjectTechnologies: row.show_project_technologies !== false,
    showProjectClient: row.show_project_client !== false,
    showProjectDate: row.show_project_date !== false,
    skillsLayout: row.skills_layout || DEFAULT_BUILDER_SETTINGS.skillsLayout,
    groupSkillsByCategory: row.group_skills_by_category !== false,
    showFooterSocialLinks: row.show_footer_social_links !== false,
    showBackToTop: row.show_back_to_top !== false,
    footerText: row.footer_text || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error("Usuário não autenticado.");

  return data.user;
}

export function applyBuilderPreset(currentSettings, presetId) {
  const preset = BUILDER_PRESETS[presetId];

  if (!preset) return currentSettings;

  return {
    ...currentSettings,
    ...preset,
    preset: presetId,
  };
}

export async function getCurrentBuilderSettings() {
  const user = await requireCurrentUser();

  const { data, error } = await supabase
    .from("portfolio_builder_settings")
    .select(SELECT)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return mapSettings(data);
}

export async function saveCurrentBuilderSettings(values) {
  const user = await requireCurrentUser();

  const payload = {
    user_id: user.id,
    preset: values.preset,
    sections: normalizeSections(values.sections),
    hero_layout: values.heroLayout,
    show_hero_avatar: Boolean(values.showHeroAvatar),
    show_resume_button: Boolean(values.showResumeButton),
    show_contact_button: Boolean(values.showContactButton),
    show_social_links: Boolean(values.showSocialLinks),
    card_style: values.cardStyle,
    button_style: values.buttonStyle,
    navbar_style: values.navbarStyle,
    container_width: values.containerWidth,
    section_spacing: values.sectionSpacing,
    content_alignment: values.contentAlignment,
    projects_columns: Number(values.projectsColumns) || 3,
    projects_per_page: Number(values.projectsPerPage) || 6,
    show_project_filters: Boolean(values.showProjectFilters),
    show_project_technologies: Boolean(values.showProjectTechnologies),
    show_project_client: Boolean(values.showProjectClient),
    show_project_date: Boolean(values.showProjectDate),
    skills_layout: values.skillsLayout,
    group_skills_by_category: Boolean(values.groupSkillsByCategory),
    show_footer_social_links: Boolean(values.showFooterSocialLinks),
    show_back_to_top: Boolean(values.showBackToTop),
    footer_text: values.footerText?.trim() || null,
  };

  const { data, error } = await supabase
    .from("portfolio_builder_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select(SELECT)
    .single();

  if (error) throw error;

  return mapSettings(data);
}
