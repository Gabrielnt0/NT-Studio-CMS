function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function GoalRow({ label, current, target, helper }) {
  const safeTarget = Math.max(Number(target) || 0, 1);
  const safeCurrent = Math.max(Number(current) || 0, 0);
  const progress = clamp((safeCurrent / safeTarget) * 100);
  const reached = safeCurrent >= safeTarget;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          <p className="mt-1 text-xs text-zinc-500">{helper}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${reached ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-blue-500/20 bg-blue-500/10 text-blue-300"}`}>
          {reached ? "Meta atingida" : `${Math.round(progress)}%`}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full transition-all duration-500 ${reached ? "bg-emerald-400" : "bg-blue-400"}`} style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-zinc-400">Atual: <strong className="text-zinc-200">{formatNumber(safeCurrent)}</strong></span>
        <span className="text-zinc-500">Meta: {formatNumber(safeTarget)}</span>
      </div>
    </div>
  );
}

export default function AnalyticsGoalsCard({ metrics, periodDays }) {
  const days = Math.max(Number(periodDays) || 1, 1);
  const activeUsers = Number(metrics?.activeUsers) || 0;
  const sessions = Number(metrics?.sessions) || 0;
  const views = Number(metrics?.screenPageViews) || 0;
  const events = Number(metrics?.eventCount) || 0;

  const goals = [
    {
      label: "Audiência do período",
      current: activeUsers,
      target: Math.max(days * 10, 100),
      helper: "Referência inicial de 10 utilizadores por dia.",
    },
    {
      label: "Sessões geradas",
      current: sessions,
      target: Math.max(activeUsers * 1.25, days * 12),
      helper: "Procura manter mais de uma sessão por utilizador.",
    },
    {
      label: "Consumo de conteúdo",
      current: views,
      target: Math.max(sessions * 1.8, days * 20),
      helper: "Referência de aproximadamente duas páginas por sessão.",
    },
    {
      label: "Interações registadas",
      current: events,
      target: Math.max(sessions * 3, days * 30),
      helper: "Ajuda a verificar se os visitantes estão a interagir.",
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Objetivos automáticos</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Progresso do período</h2>
          <p className="mt-1 text-sm text-zinc-500">Metas de referência calculadas com base na janela selecionada.</p>
        </div>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">{days} dias</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {goals.map((goal) => <GoalRow key={goal.label} {...goal} />)}
      </div>
    </section>
  );
}
