const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatChange(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return `${numeric > 0 ? "+" : ""}${numeric.toFixed(1)}%`;
}

function buildInsights(metrics) {
  const comparison = metrics?.comparison ?? {};
  const candidates = [
    { key: "activeUsers", label: "Usuários", value: comparison.activeUsers },
    { key: "sessions", label: "Sessões", value: comparison.sessions },
    { key: "screenPageViews", label: "Visualizações", value: comparison.screenPageViews },
    { key: "eventCount", label: "Eventos", value: comparison.eventCount },
  ].filter((item) => Number.isFinite(Number(item.value)));

  const insights = candidates
    .sort((left, right) => Math.abs(Number(right.value)) - Math.abs(Number(left.value)))
    .slice(0, 2)
    .map((item) => ({
      tone: Number(item.value) >= 0 ? "positive" : "negative",
      title: `${item.label} ${Number(item.value) >= 0 ? "cresceram" : "diminuíram"}`,
      detail: `${formatChange(item.value)} em relação ao período anterior.`,
    }));

  const topCountry = metrics?.countries?.[0];
  if (topCountry) {
    insights.push({
      tone: "neutral",
      title: `${topCountry.country || "País não definido"} lidera a audiência`,
      detail: `${numberFormatter.format(Number(topCountry.activeUsers ?? 0))} usuários no período.`,
    });
  }

  const topPage = metrics?.topPages?.[0];
  if (topPage) {
    insights.push({
      tone: "neutral",
      title: "Conteúdo com maior alcance",
      detail: `${topPage.title || topPage.page || "Página sem título"} teve ${numberFormatter.format(Number(topPage.views ?? 0))} visualizações.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      tone: "neutral",
      title: "Dados prontos para análise",
      detail: "Sincronize períodos adicionais para liberar comparações e tendências automáticas.",
    });
  }

  return insights.slice(0, 4);
}

const toneClasses = {
  positive: "border-emerald-500/20 bg-emerald-500/5",
  negative: "border-red-500/20 bg-red-500/5",
  neutral: "border-zinc-800 bg-zinc-950/50",
};

const dotClasses = {
  positive: "bg-emerald-400",
  negative: "bg-red-400",
  neutral: "bg-blue-400",
};

export default function AnalyticsExecutiveSummary({ metrics = {}, periodDays = 30 }) {
  const insights = buildInsights(metrics);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Resumo executivo</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Principais sinais do período</h2>
          <p className="mt-1 text-sm text-zinc-500">Leitura automática baseada nos últimos {periodDays} dias.</p>
        </div>
        <span className="w-fit rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-500">{insights.length} insights</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight, index) => (
          <article key={`${insight.title}-${index}`} className={`rounded-xl border p-4 ${toneClasses[insight.tone]}`}>
            <div className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClasses[insight.tone]}`} />
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">{insight.title}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{insight.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
