const numberFormatter = new Intl.NumberFormat("pt-BR");

function percentage(value, base) {
  if (!base || base <= 0) return 0;
  return Math.min((value / base) * 100, 100);
}

export default function AnalyticsFunnelCard({ metrics = {} }) {
  const steps = [
    { label: "Usuários", value: Number(metrics.activeUsers ?? 0) },
    { label: "Sessões", value: Number(metrics.sessions ?? 0) },
    { label: "Visualizações", value: Number(metrics.screenPageViews ?? 0) },
    { label: "Eventos", value: Number(metrics.eventCount ?? 0) },
  ];
  const maximum = Math.max(...steps.map((step) => step.value), 1);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div>
        <h2 className="font-semibold text-white">Fluxo de interação</h2>
        <p className="mt-1 text-sm text-zinc-500">Relação visual entre audiência, sessões e ações.</p>
      </div>

      <div className="mt-6 space-y-3">
        {steps.map((step, index) => {
          const previousValue = index > 0 ? steps[index - 1].value : null;
          const relative = percentage(step.value, maximum);
          const previousRatio = previousValue ? (step.value / previousValue) * 100 : null;

          return (
            <div key={step.label}>
              <div className="mb-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-300">{step.label}</p>
                  {previousRatio !== null && (
                    <p className="text-[11px] text-zinc-600">{previousRatio.toFixed(1)}% da etapa anterior</p>
                  )}
                </div>
                <strong className="text-lg text-white">{numberFormatter.format(step.value)}</strong>
              </div>
              <div className="h-9 overflow-hidden rounded-lg bg-zinc-950">
                <div
                  className="flex h-full min-w-12 items-center rounded-lg border border-blue-400/20 bg-gradient-to-r from-blue-600/80 to-violet-500/70 px-3 transition-[width] duration-700"
                  style={{ width: `${Math.max(relative, 8)}%` }}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">Etapa {index + 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
