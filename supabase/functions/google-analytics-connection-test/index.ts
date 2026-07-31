import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

type RequestBody = {
  action?: "test" | "sync";
  periodDays?: 7 | 30 | 90;
};

type Report = {
  metricHeaders?: Array<{ name: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function base64Url(input: Uint8Array | string) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string) {
  const normalized = pem.replace(/\\n/g, "\n");
  const base64 = normalized
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

async function getGoogleAccessToken(serviceAccount: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: serviceAccount.token_uri || "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const assertion = `${unsigned}.${base64Url(new Uint8Array(signature))}`;
  const response = await fetch(serviceAccount.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "O Google recusou a autenticação da conta de serviço.");
  }
  return data.access_token as string;
}

async function runReport(accessToken: string, propertyId: string, body: Record<string, unknown>): Promise<Report> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "A Google Analytics Data API recusou a consulta.");
  return data;
}

async function optionalReport(
  name: string,
  accessToken: string,
  propertyId: string,
  body: Record<string, unknown>,
): Promise<Report> {
  try {
    return await runReport(accessToken, propertyId, body);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Relatório opcional ${name} não pôde ser carregado: ${message}`);
    return { rows: [], metricHeaders: [] };
  }
}

function metricValue(report: Report, name: string) {
  const index = report.metricHeaders?.findIndex((item) => item.name === name) ?? -1;
  if (index < 0) return 0;
  return Number(report.rows?.[0]?.metricValues?.[index]?.value || 0);
}

function formatDuration(seconds: number) {
  const rounded = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(rounded / 60);
  const remaining = rounded % 60;
  return `${minutes}m ${String(remaining).padStart(2, "0")}s`;
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function compactDate(date: Date) {
  return toDateString(date).replaceAll("-", "");
}

function getDateRanges(periodDays: number) {
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = addDays(end, -(periodDays - 1));
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(periodDays - 1));
  return {
    current: { startDate: toDateString(start), endDate: toDateString(end) },
    previous: { startDate: toDateString(previousStart), endDate: toDateString(previousEnd) },
    start,
    end,
  };
}

function denseDailyRows(report: Report, start: Date, end: Date) {
  const byDate = new Map<string, { activeUsers: number; sessions: number; screenPageViews: number }>();
  for (const row of report.rows || []) {
    const date = row.dimensionValues?.[0]?.value || "";
    byDate.set(date, {
      activeUsers: Number(row.metricValues?.[0]?.value || 0),
      sessions: Number(row.metricValues?.[1]?.value || 0),
      screenPageViews: Number(row.metricValues?.[2]?.value || 0),
    });
  }

  const rows = [];
  for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, 1)) {
    const date = compactDate(cursor);
    const values = byDate.get(date) || { activeUsers: 0, sessions: 0, screenPageViews: 0 };
    rows.push({ date, ...values });
  }
  return rows;
}

async function collectMetrics(accessToken: string, propertyId: string, requestedDays = 30) {
  const periodDays = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  const ranges = getDateRanges(periodDays);
  const summaryMetrics = [
    { name: "activeUsers" },
    { name: "sessions" },
    { name: "screenPageViews" },
    { name: "eventCount" },
    { name: "averageSessionDuration" },
  ];

  const summary = await runReport(accessToken, propertyId, {
    dateRanges: [ranges.current],
    metrics: summaryMetrics,
  });

  const [previousSummary, daily, countries, devices, browsers, sources, pages, landingPages] = await Promise.all([
    optionalReport("comparação", accessToken, propertyId, { dateRanges: [ranges.previous], metrics: summaryMetrics }),
    optionalReport("evolução diária", accessToken, propertyId, {
      dateRanges: [ranges.current],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
      keepEmptyRows: true,
    }),
    optionalReport("países", accessToken, propertyId, {
      dateRanges: [ranges.current], dimensions: [{ name: "country" }], metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }], limit: 10,
    }),
    optionalReport("dispositivos", accessToken, propertyId, {
      dateRanges: [ranges.current], dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }),
    optionalReport("navegadores", accessToken, propertyId, {
      dateRanges: [ranges.current], dimensions: [{ name: "browser" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 10,
    }),
    optionalReport("aquisição", accessToken, propertyId, {
      dateRanges: [ranges.current], dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 10,
    }),
    optionalReport("páginas", accessToken, propertyId, {
      dateRanges: [ranges.current], dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 15,
    }),
    optionalReport("landing pages", accessToken, propertyId, {
      dateRanges: [ranges.current], dimensions: [{ name: "landingPagePlusQueryString" }], metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 10,
    }),
  ]);

  const current = {
    activeUsers: metricValue(summary, "activeUsers"),
    sessions: metricValue(summary, "sessions"),
    screenPageViews: metricValue(summary, "screenPageViews"),
    eventCount: metricValue(summary, "eventCount"),
    averageSessionDuration: metricValue(summary, "averageSessionDuration"),
  };
  const previous = {
    activeUsers: metricValue(previousSummary, "activeUsers"),
    sessions: metricValue(previousSummary, "sessions"),
    screenPageViews: metricValue(previousSummary, "screenPageViews"),
    eventCount: metricValue(previousSummary, "eventCount"),
    averageSessionDuration: metricValue(previousSummary, "averageSessionDuration"),
  };

  return {
    period: { days: periodDays, ...ranges.current },
    ...current,
    users: current.activeUsers,
    views: current.screenPageViews,
    events: current.eventCount,
    averageSessionDurationFormatted: formatDuration(current.averageSessionDuration),
    daily: denseDailyRows(daily, ranges.start, ranges.end),
    comparison: {
      activeUsers: percentageChange(current.activeUsers, previous.activeUsers),
      sessions: percentageChange(current.sessions, previous.sessions),
      screenPageViews: percentageChange(current.screenPageViews, previous.screenPageViews),
      eventCount: percentageChange(current.eventCount, previous.eventCount),
      averageSessionDuration: percentageChange(current.averageSessionDuration, previous.averageSessionDuration),
    },
    countries: (countries.rows || []).map((row) => ({
      country: row.dimensionValues?.[0]?.value || "Não definido",
      activeUsers: Number(row.metricValues?.[0]?.value || 0),
    })),
    devices: (devices.rows || []).map((row) => ({
      device: row.dimensionValues?.[0]?.value || "Não definido",
      activeUsers: Number(row.metricValues?.[0]?.value || 0),
    })),
    browsers: (browsers.rows || []).map((row) => {
      const sessions = Number(row.metricValues?.[0]?.value || 0);
      const activeUsers = Number(row.metricValues?.[1]?.value || 0);
      return {
        browser: row.dimensionValues?.[0]?.value || "Não identificado",
        sessions,
        activeUsers: activeUsers || sessions,
      };
    }),
    trafficSources: (sources.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Não definido",
      sessions: Number(row.metricValues?.[0]?.value || 0),
      activeUsers: Number(row.metricValues?.[1]?.value || 0),
    })),
    topPages: (pages.rows || []).map((row) => ({
      title: row.dimensionValues?.[0]?.value || "Sem título",
      page: row.dimensionValues?.[1]?.value || "/",
      views: Number(row.metricValues?.[0]?.value || 0),
      activeUsers: Number(row.metricValues?.[1]?.value || 0),
    })),
    landingPages: (landingPages.rows || []).map((row) => ({
      page: row.dimensionValues?.[0]?.value || "/",
      sessions: Number(row.metricValues?.[0]?.value || 0),
    })),
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ ok: false, message: "Método não permitido." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const serviceAccountRaw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  const authorization = request.headers.get("Authorization");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) return json({ ok: false, message: "Secrets internos do Supabase não estão disponíveis." }, 500);
  if (!authorization) return json({ ok: false, message: "Sessão de utilizador não encontrada." }, 401);
  if (!serviceAccountRaw) return json({ ok: false, message: "O secret GOOGLE_SERVICE_ACCOUNT_JSON ainda não foi configurado." }, 500);

  let requestBody: RequestBody | null = null;
  try {
    requestBody = await request.json() as RequestBody;
    const action = requestBody.action === "sync" ? "sync" : "test";
    const periodDays = [7, 30, 90].includes(Number(requestBody.periodDays)) ? Number(requestBody.periodDays) : 30;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ ok: false, message: "Sessão inválida ou expirada." }, 401);

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: settings, error: settingsError } = await admin
      .from("portfolio_settings")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    if (settingsError || !settings) return json({ ok: false, message: "Configurações do portfólio não encontradas." }, 404);
    if (!settings.google_analytics_enabled) return json({ ok: false, message: "Ative o Google Analytics nas Configurações." }, 400);

    const propertyId = String(settings.google_analytics_property_id || "").trim();
    if (!/^\d+$/.test(propertyId)) return json({ ok: false, message: "Property ID inválido. Use somente o número da propriedade GA4." }, 400);

    const serviceAccount = JSON.parse(serviceAccountRaw) as ServiceAccount;
    if (!serviceAccount.client_email || !serviceAccount.private_key) throw new Error("O JSON da conta de serviço está incompleto.");

    const accessToken = await getGoogleAccessToken(serviceAccount);
    const metrics = await collectMetrics(accessToken, propertyId, periodDays);
    const now = new Date().toISOString();
    const updatePayload: Record<string, unknown> = {
      google_analytics_connection_status: "connected",
      google_analytics_last_error: null,
      google_analytics_preview: metrics,
      updated_at: now,
    };
    if (action === "sync") updatePayload.google_analytics_last_synced_at = now;
    const { error: updateError } = await admin
      .from("portfolio_settings")
      .update(updatePayload)
      .eq("user_id", userData.user.id);
    if (updateError) throw updateError;

    if (action === "sync") {
      const { error: snapshotError } = await admin.from("analytics_snapshots").insert({
        user_id: userData.user.id,
        period_days: periodDays,
        period_start: metrics.period.startDate,
        period_end: metrics.period.endDate,
        payload: metrics,
      });
      if (snapshotError) console.error("analytics_snapshots:", snapshotError.message);
    }

    return json({
      ok: true,
      action,
      message: action === "sync" ? "Métricas do Google Analytics sincronizadas." : "Conexão com o Google Analytics confirmada.",
      testedAt: now,
      lastSyncedAt: action === "sync" ? now : null,
      metrics,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    console.error(message);
    if (supabaseUrl && serviceRoleKey && authorization) {
      try {
        const userClient = createClient(supabaseUrl, anonKey!, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false } });
        const { data: userData } = await userClient.auth.getUser();
        if (userData.user) {
          const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
          await admin.from("portfolio_settings").update({ google_analytics_connection_status: "error", google_analytics_last_error: message }).eq("user_id", userData.user.id);
        }
      } catch {
        // O registo do erro não deve substituir a resposta principal.
      }
    }
    return json({ ok: false, message }, 500);
  }
});
