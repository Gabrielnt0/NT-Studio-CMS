import { supabase } from "../../../services/supabase";

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Sessão não encontrada.");
  return data.user;
}

export async function getPortfolioSettings() {
  const user = await getCurrentUser();
  const { data, error } = await supabase.from("portfolio_settings").select("*").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveGoogleAnalyticsSettings(values) {
  const user = await getCurrentUser();
  const payload = {
    user_id: user.id,
    google_analytics_enabled: Boolean(values.enabled),
    google_analytics_measurement_id: String(values.measurementId ?? "").trim().toUpperCase() || null,
    google_analytics_property_id: String(values.propertyId ?? "").trim() || null,
    google_analytics_connection_status: "pending",
    google_analytics_last_error: null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("portfolio_settings").upsert(payload, { onConflict: "user_id" }).select().single();
  if (error) throw error;
  return data;
}

export async function testGoogleAnalyticsSettings(periodDays = 30) {
  const { data, error } = await supabase.functions.invoke("google-analytics-connection-test", { body: { action: "test", periodDays } });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.message || "Não foi possível testar a conexão.");
  return data;
}

export async function syncGoogleAnalyticsSettings(periodDays = 30) {
  const { data, error } = await supabase.functions.invoke("google-analytics-connection-test", { body: { action: "sync", periodDays } });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.message || "Não foi possível sincronizar as métricas.");
  return data;
}
