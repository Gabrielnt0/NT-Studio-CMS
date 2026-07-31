function formatChange(value) {
  const number = Number(value ?? 0);
  const prefix = number > 0 ? "+" : "";
  return `${prefix}${number.toFixed(1)}%`;
}

function tone(value) {
  const number = Number(value ?? 0);
  if (number > 0) return "text-emerald-300";
  if (number < 0) return "text-red-300";
  return "text-zinc-400";
}

export default function AnalyticsKpiComparison({ metrics = {} }) {
  const comparison = metrics.comparison ?? {};
  const rows = [
    { label: "Usuários", current: metrics.activeUsers ?? 0, change: comparison.activeUsers },
    { label: "Sessões", current: metrics.sessions ?? 0, change: comparison.sessions },
    { label: "Visualizações", current: metrics.screenPageViews ?? 0, change: comparison.screenPageViews },
    { label: "Eventos", current: metrics.eventCount ?? 0, change: comparison.eventCount },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70">
      <div className="border-b border-zinc-800 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Comparação</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Desempenho contra o período anterior</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-zinc-900/80 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3 font-medium">Métrica</th>
              <th className="px-5 py-3 text-right font-medium">Valor atual</th>
              <th className="px-5 py-3 text-right font-medium">Variação</th>
              <th className="px-5 py-3 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const value = Number(row.change ?? 0);
              return (
                <tr key={row.label} className="border-t border-zinc-900 text-zinc-300">
                  <td className="px-5 py-3.5 font-medium text-zinc-200">{row.label}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{new Intl.NumberFormat("pt-BR").format(Number(row.current ?? 0))}</td>
                  <td className={`px-5 py-3.5 text-right font-semibold tabular-nums ${tone(value)}`}>{formatChange(value)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${value > 0 ? "bg-emerald-500/10 text-emerald-300" : value < 0 ? "bg-red-500/10 text-red-300" : "bg-zinc-800 text-zinc-400"}`}>
                      {value > 0 ? "Crescimento" : value < 0 ? "Queda" : "Estável"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
