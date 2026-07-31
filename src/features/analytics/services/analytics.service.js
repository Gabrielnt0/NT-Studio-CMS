import { supabase } from "../../../services/supabase";

function normalizePeriodDays(value) {
  const days = Number(value);
  return [7, 30, 90].includes(days) ? days : 30;
}

function normalizeMetrics(metrics = {}) {
  return {
    period: metrics.period ?? null,
    activeUsers: Number(metrics.activeUsers ?? metrics.users ?? 0),
    users: Number(metrics.users ?? metrics.activeUsers ?? 0),
    sessions: Number(metrics.sessions ?? 0),
    screenPageViews: Number(metrics.screenPageViews ?? metrics.views ?? 0),
    views: Number(metrics.views ?? metrics.screenPageViews ?? 0),
    eventCount: Number(metrics.eventCount ?? metrics.events ?? 0),
    events: Number(metrics.events ?? metrics.eventCount ?? 0),
    averageSessionDuration: Number(metrics.averageSessionDuration ?? 0),
    averageSessionDurationFormatted: metrics.averageSessionDurationFormatted ?? metrics.averageEngagementTime ?? "0m 00s",
    daily: Array.isArray(metrics.daily) ? metrics.daily : [],
    countries: Array.isArray(metrics.countries) ? metrics.countries : [],
    devices: Array.isArray(metrics.devices) ? metrics.devices : [],
    browsers: Array.isArray(metrics.browsers) ? metrics.browsers : [],
    trafficSources: Array.isArray(metrics.trafficSources) ? metrics.trafficSources : [],
    topPages: Array.isArray(metrics.topPages) ? metrics.topPages : [],
    landingPages: Array.isArray(metrics.landingPages) ? metrics.landingPages : [],
    conversions: Number(metrics.conversions ?? metrics.keyEvents ?? metrics.conversionCount ?? 0),
    keyEvents: Number(metrics.keyEvents ?? metrics.conversions ?? metrics.conversionCount ?? 0),
    conversionCount: Number(metrics.conversionCount ?? metrics.keyEvents ?? metrics.conversions ?? 0),
    conversionEvents: Array.isArray(metrics.conversionEvents) ? metrics.conversionEvents : [],
    customEvents: Array.isArray(metrics.customEvents) ? metrics.customEvents : [],
    keyEventsBreakdown: Array.isArray(metrics.keyEventsBreakdown) ? metrics.keyEventsBreakdown : [],
    conversionsBySource: Array.isArray(metrics.conversionsBySource) ? metrics.conversionsBySource : [],
    conversionsByDevice: Array.isArray(metrics.conversionsByDevice) ? metrics.conversionsByDevice : [],
    seo: metrics.seo && typeof metrics.seo === "object" ? metrics.seo : {},
    searchConsole: metrics.searchConsole && typeof metrics.searchConsole === "object" ? metrics.searchConsole : {},
    seoQueries: Array.isArray(metrics.seoQueries) ? metrics.seoQueries : [],
    seoPages: Array.isArray(metrics.seoPages) ? metrics.seoPages : [],
    seoClicks: Number(metrics.seoClicks ?? 0),
    seoImpressions: Number(metrics.seoImpressions ?? 0),
    seoCtr: Number(metrics.seoCtr ?? 0),
    seoAveragePosition: Number(metrics.seoAveragePosition ?? 0),
    searchConsoleConnected: Boolean(metrics.searchConsoleConnected),
    marketing: metrics.marketing && typeof metrics.marketing === "object" ? metrics.marketing : {},
    marketingCampaigns: Array.isArray(metrics.marketingCampaigns) ? metrics.marketingCampaigns : [],
    marketingChannels: Array.isArray(metrics.marketingChannels) ? metrics.marketingChannels : [],
    marketingSpend: Number(metrics.marketingSpend ?? 0),
    marketingRevenue: Number(metrics.marketingRevenue ?? 0),
    marketingConversions: Number(metrics.marketingConversions ?? 0),
    marketingClicks: Number(metrics.marketingClicks ?? 0),
    marketingImpressions: Number(metrics.marketingImpressions ?? 0),
    marketingConnected: Boolean(metrics.marketingConnected),
    clarity: metrics.clarity && typeof metrics.clarity === "object" ? metrics.clarity : {},
    clarityRecordings: Array.isArray(metrics.clarityRecordings) ? metrics.clarityRecordings : [],
    clarityHeatmaps: Array.isArray(metrics.clarityHeatmaps) ? metrics.clarityHeatmaps : [],
    clarityPages: Array.isArray(metrics.clarityPages) ? metrics.clarityPages : [],
    claritySessions: Number(metrics.claritySessions ?? 0),
    clarityProblemSessions: Number(metrics.clarityProblemSessions ?? 0),
    clarityRageClicks: Number(metrics.clarityRageClicks ?? 0),
    clarityDeadClicks: Number(metrics.clarityDeadClicks ?? 0),
    clarityQuickBacks: Number(metrics.clarityQuickBacks ?? 0),
    clarityExcessiveScroll: Number(metrics.clarityExcessiveScroll ?? 0),
    clarityJsErrors: Number(metrics.clarityJsErrors ?? 0),
    clarityAverageScrollDepth: Number(metrics.clarityAverageScrollDepth ?? 0),
    clarityConnected: Boolean(metrics.clarityConnected),
    comparison: metrics.comparison && typeof metrics.comparison === "object" ? metrics.comparison : {},
  };
}

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Sessão não encontrada.");
  return data.user;
}

function settingsToIntegration(settings) {
  if (!settings) return null;
  return {
    id: settings.id,
    provider: "google_analytics",
    enabled: Boolean(settings.google_analytics_enabled),
    connection_status: settings.google_analytics_connection_status ?? "pending",
    last_synced_at: settings.google_analytics_last_synced_at ?? null,
    last_error: settings.google_analytics_last_error ?? null,
    config: {
      measurementId: settings.google_analytics_measurement_id ?? "",
      propertyId: settings.google_analytics_property_id ?? "",
    },
  };
}

export async function getAnalyticsOverview({ periodDays = 30 } = {}) {
  const normalizedDays = normalizePeriodDays(periodDays);
  const user = await getCurrentUser();

  const [{ data: settings, error: settingsError }, { data: snapshot, error: snapshotError }] = await Promise.all([
    supabase.from("portfolio_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("analytics_snapshots")
      .select("payload,period_days,created_at")
      .eq("user_id", user.id)
      .eq("period_days", normalizedDays)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (settingsError) throw settingsError;
  if (snapshotError) throw snapshotError;

  const integration = settingsToIntegration(settings);
  const metrics = snapshot?.payload ?? settings?.google_analytics_preview ?? {};
  const portfolioProject = { id: "portfolio", name: "Meu Portfólio", slug: "portfolio" };

  return {
    projects: [portfolioProject],
    selectedProject: portfolioProject,
    integration,
    periodDays: normalizedDays,
    metrics: normalizeMetrics(metrics),
  };
}

async function extractFunctionError(error) {
  const contextBody = error?.context?.body;
  if (contextBody?.message) return contextBody.message;
  const response = error?.context;
  if (response && typeof response.clone === "function") {
    try {
      const payload = await response.clone().json();
      if (payload?.message) return payload.message;
    } catch {
      // Mantém a mensagem padrão abaixo.
    }
  }
  return error?.message || "A Edge Function não respondeu corretamente.";
}

async function invokeAnalyticsFunction(action, periodDays) {
  const { data, error } = await supabase.functions.invoke("google-analytics-connection-test", {
    body: { action, periodDays: normalizePeriodDays(periodDays) },
  });
  if (error) throw new Error(await extractFunctionError(error));
  if (!data?.ok) throw new Error(data?.message || "Não foi possível consultar o Google Analytics.");
  return { ...data, metrics: normalizeMetrics(data.metrics) };
}

export function syncAnalytics(periodDays = 30) {
  return invokeAnalyticsFunction("sync", periodDays);
}

export function testAnalyticsConnection(periodDays = 30) {
  return invokeAnalyticsFunction("test", periodDays);
}
