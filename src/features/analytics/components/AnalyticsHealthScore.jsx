function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function scoreColor(score) {
  if (score >= 80) return "text-emerald-300";
  if (score >= 60) return "text-amber-300";
  return "text-red-300";
}

function statusLabel(score) {
  if (score >= 80) return "Saudável";
  if (score >= 60) return "Atenção";
  return "Crítico";
}

export default function AnalyticsHealthScore({ metrics = {}, connected = false }) {
  const sessions = Number(metrics.sessions ?? 0);
  const users = Number(metrics.activeUsers ?? 0);
  const views = Number(metrics.screenPageViews ?? 0);
  const duration = Number(metrics.averageSessionDuration ?? 0);
  const sources = Array.isArray(metrics.trafficSources) ? metrics.trafficSources.length : 0;

  let score = connected ? 30 : 0;
  if (users > 0) score += 15;
  if (sessions > 0) score += 15;
  if (views >= sessions && sessions > 0) score += 15;
  if (duration >= 60) score += 10;
  if (sources >= 3) score += 10;
  if ((metrics.daily ?? []).some((row) => Number(row.sessions ?? 0) > 0)) score += 5;
  score = clamp(score);

  const items = [
    { label: "Integração ativa", done: connected },
    { label: "Tráfego registado", done: sessions > 0 },
    { label: "Conteúdo visualizado", done: views > 0 },
    { label: "Retenção mínima", done: duration >= 60 },
    { label: "Aquisição diversificada", done: sources >= 3 },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Saúde do Analytics</p>
          <div className="mt-2 flex items-end gap-3">
            <strong className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</strong>
            <span className="pb-1 text-sm text-zinc-500">/ 100 · {statusLabel(score)}</span>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Pontuação calculada localmente com base na ligação, volume de dados, retenção e diversidade de aquisição.
          </p>
        </div>

        <div className="grid min-w-full gap-2 sm:grid-cols-2 lg:min-w-[420px]">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${item.done ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-800 text-zinc-500"}`}>
                {item.done ? "✓" : "–"}
              </span>
              <span className={item.done ? "text-zinc-200" : "text-zinc-500"}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-900">
        <div className="h-full rounded-full bg-current transition-all duration-500" style={{ width: `${score}%`, color: score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171" }} />
      </div>
    </section>
  );
}
