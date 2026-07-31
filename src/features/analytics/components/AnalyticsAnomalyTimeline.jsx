function getChange(comparison, key) {
  const raw = comparison?.[key];
  if (typeof raw === "number") return raw;
  if (raw && typeof raw === "object") {
    return Number(raw.percentage ?? raw.change ?? raw.value ?? 0) || 0;
  }
  return Number(raw) || 0;
}

function buildItems(metrics) {
  const comparison = metrics?.comparison ?? {};
  const definitions = [
    ["activeUsers", "Utilizadores", "a audiência"],
    ["sessions", "Sessões", "o volume de sessões"],
    ["screenPageViews", "Visualizações", "o consumo de páginas"],
    ["eventCount", "Eventos", "as interações"],
  ];

  return definitions
    .map(([key, label, subject]) => {
      const change = getChange(comparison, key);
      const abs = Math.abs(change);
      const level = abs >= 25 ? "high" : abs >= 10 ? "medium" : "stable";
      const direction = change > 0 ? "up" : change < 0 ? "down" : "stable";
      const text = direction === "up"
        ? `${subject} aumentaram ${abs.toFixed(1)}% em relação ao período anterior.`
        : direction === "down"
          ? `${subject} diminuíram ${abs.toFixed(1)}% em relação ao período anterior.`
          : `${subject} permaneceram estáveis em relação ao período anterior.`;
      return { key, label, change, abs, level, direction, text };
    })
    .sort((a, b) => b.abs - a.abs);
}

const tone = {
  up: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  down: "border-red-500/20 bg-red-500/10 text-red-300",
  stable: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
};

export default function AnalyticsAnomalyTimeline({ metrics }) {
  const items = buildItems(metrics);
  const meaningful = items.filter((item) => item.level !== "stable");

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Detetor de variações</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Movimentos importantes</h2>
        <p className="mt-1 text-sm text-zinc-500">Leitura automática das principais mudanças do período.</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div key={item.key} className="relative flex gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex flex-col items-center">
              <span className={`flex h-8 min-w-8 items-center justify-center rounded-full border text-xs font-bold ${tone[item.direction]}`}>
                {item.direction === "up" ? "↑" : item.direction === "down" ? "↓" : "="}
              </span>
              {index < items.length - 1 && <span className="mt-2 h-full w-px bg-zinc-800" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-zinc-200">{item.label}</p>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone[item.direction]}`}>
                  {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              <p className="mt-2 text-xs text-zinc-600">
                {item.level === "high" ? "Variação forte: merece atenção prioritária." : item.level === "medium" ? "Variação moderada: acompanhe a tendência." : "Sem alteração relevante."}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-xs text-zinc-500">
        {meaningful.length > 0 ? `${meaningful.length} indicador(es) apresentaram variação relevante.` : "Nenhuma variação relevante foi detetada neste período."}
      </div>
    </section>
  );
}
