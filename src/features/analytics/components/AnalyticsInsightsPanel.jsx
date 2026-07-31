function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getChange(comparison, key) {
  const raw = comparison?.[key];
  if (typeof raw === "number") return raw;
  if (raw && typeof raw === "object") {
    return toNumber(raw.percentage ?? raw.change ?? raw.value);
  }
  return toNumber(raw);
}

function getRowLabel(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "Não identificado";
}

function buildInsights(metrics, connected) {
  const comparison = metrics?.comparison ?? {};
  const daily = Array.isArray(metrics?.daily) ? metrics.daily : [];
  const sources = Array.isArray(metrics?.trafficSources) ? metrics.trafficSources : [];
  const pages = Array.isArray(metrics?.topPages) ? metrics.topPages : [];
  const devices = Array.isArray(metrics?.devices) ? metrics.devices : [];

  const usersChange = getChange(comparison, "activeUsers");
  const sessionsChange = getChange(comparison, "sessions");
  const viewsChange = getChange(comparison, "screenPageViews");
  const eventsChange = getChange(comparison, "eventCount");

  const changes = [
    { key: "activeUsers", label: "Utilizadores", value: usersChange },
    { key: "sessions", label: "Sessões", value: sessionsChange },
    { key: "screenPageViews", label: "Visualizações", value: viewsChange },
    { key: "eventCount", label: "Eventos", value: eventsChange },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const strongest = changes[0];
  const totalSessions = Math.max(toNumber(metrics?.sessions), 1);
  const totalViews = toNumber(metrics?.screenPageViews);
  const totalEvents = toNumber(metrics?.eventCount);
  const viewsPerSession = totalViews / totalSessions;
  const eventsPerSession = totalEvents / totalSessions;

  const topSource = [...sources].sort((a, b) => toNumber(b.sessions) - toNumber(a.sessions))[0];
  const topPage = [...pages].sort((a, b) => toNumber(b.views) - toNumber(a.views))[0];
  const topDevice = [...devices].sort((a, b) => toNumber(b.users ?? b.activeUsers ?? b.sessions ?? b.value) - toNumber(a.users ?? a.activeUsers ?? a.sessions ?? a.value))[0];

  const dailyUsers = daily.map((row) => toNumber(row.activeUsers));
  const lastSeven = dailyUsers.slice(-7);
  const previousSeven = dailyUsers.slice(-14, -7);
  const currentAverage = lastSeven.length ? lastSeven.reduce((sum, value) => sum + value, 0) / lastSeven.length : 0;
  const previousAverage = previousSeven.length ? previousSeven.reduce((sum, value) => sum + value, 0) / previousSeven.length : 0;
  const recentMomentum = previousAverage > 0 ? ((currentAverage - previousAverage) / previousAverage) * 100 : 0;

  const insights = [];

  if (!connected) {
    insights.push({
      id: "connection",
      tone: "warning",
      title: "Dados ainda não validados",
      description: "Confirme a ligação com o Google Analytics para libertar análises completas e confiáveis.",
      meta: "Ação recomendada",
    });
  }

  if (strongest && Math.abs(strongest.value) >= 1) {
    insights.push({
      id: "strongest-change",
      tone: strongest.value >= 0 ? "positive" : "negative",
      title: `${strongest.label} ${strongest.value >= 0 ? "em crescimento" : "em queda"}`,
      description: `A maior variação do período foi de ${Math.abs(strongest.value).toFixed(1)}% em ${strongest.label.toLowerCase()}.`,
      meta: "Maior movimento",
    });
  }

  if (daily.length >= 14 && Math.abs(recentMomentum) >= 5) {
    insights.push({
      id: "momentum",
      tone: recentMomentum >= 0 ? "positive" : "negative",
      title: recentMomentum >= 0 ? "Ritmo recente acelerou" : "Ritmo recente desacelerou",
      description: `A média de utilizadores dos últimos 7 dias está ${Math.abs(recentMomentum).toFixed(1)}% ${recentMomentum >= 0 ? "acima" : "abaixo"} da semana anterior.`,
      meta: "Tendência de 7 dias",
    });
  }

  if (topSource) {
    insights.push({
      id: "source",
      tone: "info",
      title: "Principal origem de tráfego",
      description: `${getRowLabel(topSource, ["source", "channel", "name"])} liderou com ${toNumber(topSource.sessions).toLocaleString("pt-BR")} sessões.`,
      meta: "Aquisição",
    });
  }

  if (topPage) {
    insights.push({
      id: "page",
      tone: "info",
      title: "Conteúdo de maior alcance",
      description: `${getRowLabel(topPage, ["title", "page", "path"])} concentrou ${toNumber(topPage.views).toLocaleString("pt-BR")} visualizações.`,
      meta: "Conteúdo",
    });
  }

  if (viewsPerSession > 0) {
    insights.push({
      id: "engagement",
      tone: viewsPerSession >= 2 ? "positive" : "warning",
      title: viewsPerSession >= 2 ? "Boa profundidade de navegação" : "Navegação pode ser aprofundada",
      description: `Cada sessão gerou em média ${viewsPerSession.toFixed(2)} visualizações e ${eventsPerSession.toFixed(2)} eventos.`,
      meta: "Envolvimento",
    });
  }

  if (topDevice) {
    insights.push({
      id: "device",
      tone: "neutral",
      title: "Dispositivo dominante",
      description: `${getRowLabel(topDevice, ["device", "category", "name"])} foi o dispositivo com maior participação no período.`,
      meta: "Tecnologia",
    });
  }

  return insights.slice(0, 6);
}

const toneClasses = {
  positive: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  negative: "border-red-500/20 bg-red-500/10 text-red-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  neutral: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
};

const dotClasses = {
  positive: "bg-emerald-400",
  negative: "bg-red-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
  neutral: "bg-zinc-400",
};

export default function AnalyticsInsightsPanel({ metrics, connected }) {
  const insights = buildInsights(metrics, connected);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Insights inteligentes</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Leitura automática do período</h2>
          <p className="mt-1 text-sm text-zinc-500">Conclusões geradas localmente a partir das métricas já disponíveis no painel.</p>
        </div>
        <span className="w-fit rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-400">
          {insights.length} insight{insights.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClasses[insight.tone]}`}>
                {insight.meta}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${dotClasses[insight.tone]}`} aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-zinc-100">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{insight.description}</p>
          </article>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-8 text-center text-sm text-zinc-500">
          Ainda não existem dados suficientes para gerar insights automáticos.
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-zinc-600">
        Estes insights não enviam dados para serviços externos e não substituem uma análise humana. Eles ajudam a destacar rapidamente tendências, oportunidades e pontos de atenção.
      </p>
    </section>
  );
}
