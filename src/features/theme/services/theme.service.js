import { supabase } from "../../../services/supabase";

export const DEFAULT_THEME = Object.freeze({
  preset: "midnight",
  mode: "dark",
  primaryColor: "#3b82f6",
  primaryHoverColor: "#60a5fa",
  secondaryColor: "#111111",
  accentColor: "#f5d76e",
  backgroundColor: "#050816",
  surfaceColor: "#0f172a",
  cardColor: "#111827",
  borderColor: "#1e293b",
  titleColor: "#f8fafc",
  textColor: "#cbd5e1",
  mutedColor: "#94a3b8",
  fontFamily: "Inter",
  borderRadius: "rounded",
  shadowStyle: "soft",
  motionEnabled: true,
});

const SELECT = `
  id,
  user_id,
  theme_key,
  mode,
  preset,
  primary_color,
  primary_hover_color,
  secondary_color,
  accent_color,
  background_color,
  surface_color,
  card_color,
  border_color,
  title_color,
  text_color,
  muted_text_color,
  muted_color,
  heading_font,
  body_font,
  font_family,
  border_radius,
  shadow_style,
  motion_enabled,
  custom_css,
  settings,
  created_at,
  updated_at
`;

async function requireCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error("Usuário não autenticado.");

  return data.user;
}

function mapTheme(row) {
  if (!row) return { ...DEFAULT_THEME };

  return {
    id: row.id,
    userId: row.user_id,
    preset: row.preset ?? row.theme_key ?? DEFAULT_THEME.preset,
    mode: row.mode ?? DEFAULT_THEME.mode,
    primaryColor: row.primary_color ?? DEFAULT_THEME.primaryColor,
    primaryHoverColor:
      row.primary_hover_color ?? DEFAULT_THEME.primaryHoverColor,
    secondaryColor: row.secondary_color ?? DEFAULT_THEME.secondaryColor,
    accentColor: row.accent_color ?? DEFAULT_THEME.accentColor,
    backgroundColor: row.background_color ?? DEFAULT_THEME.backgroundColor,
    surfaceColor: row.surface_color ?? DEFAULT_THEME.surfaceColor,
    cardColor: row.card_color ?? row.surface_color ?? DEFAULT_THEME.cardColor,
    borderColor: row.border_color ?? DEFAULT_THEME.borderColor,
    titleColor: row.title_color ?? row.text_color ?? DEFAULT_THEME.titleColor,
    textColor: row.text_color ?? DEFAULT_THEME.textColor,
    mutedColor:
      row.muted_color ?? row.muted_text_color ?? DEFAULT_THEME.mutedColor,
    fontFamily:
      row.font_family ?? row.heading_font ?? row.body_font ?? DEFAULT_THEME.fontFamily,
    borderRadius: row.border_radius ?? DEFAULT_THEME.borderRadius,
    shadowStyle: row.shadow_style ?? DEFAULT_THEME.shadowStyle,
    motionEnabled: row.motion_enabled !== false,
    customCss: row.custom_css ?? "",
    settings: row.settings ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCurrentTheme() {
  const user = await requireCurrentUser();

  const { data, error } = await supabase
    .from("portfolio_themes")
    .select(SELECT)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return mapTheme(data);
}

export async function saveCurrentTheme(values) {
  const user = await requireCurrentUser();
  const fontFamily = values.fontFamily?.trim() || DEFAULT_THEME.fontFamily;

  const payload = {
    user_id: user.id,
    theme_key: values.preset || "custom",
    mode: values.mode || "dark",
    preset: values.preset || "custom",
    primary_color: values.primaryColor,
    primary_hover_color: values.primaryHoverColor,
    secondary_color: values.secondaryColor,
    accent_color: values.accentColor,
    background_color: values.backgroundColor,
    surface_color: values.surfaceColor,
    card_color: values.cardColor,
    border_color: values.borderColor,
    title_color: values.titleColor,
    text_color: values.textColor,
    muted_text_color: values.mutedColor,
    muted_color: values.mutedColor,
    heading_font: fontFamily,
    body_font: fontFamily,
    font_family: fontFamily,
    border_radius: values.borderRadius,
    shadow_style: values.shadowStyle,
    motion_enabled: Boolean(values.motionEnabled),
    custom_css: values.customCss?.trim() || null,
    settings: values.settings ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("portfolio_themes")
    .upsert(payload, { onConflict: "user_id" })
    .select(SELECT)
    .single();

  if (error) throw error;

  return mapTheme(data);
}
