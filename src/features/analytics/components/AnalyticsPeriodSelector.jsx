const PERIODS = [
  { value: 7, label: "7 dias", shortLabel: "7d" },
  { value: 30, label: "30 dias", shortLabel: "30d" },
  { value: 90, label: "90 dias", shortLabel: "90d" },
];

export default function AnalyticsPeriodSelector({ value, onChange, disabled = false }) {
  return (
    <div
      className="inline-flex max-w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-1"
      role="group"
      aria-label="Selecionar período do relatório"
    >
      {PERIODS.map((period) => {
        const selected = Number(value) === period.value;

        return (
          <button
            key={period.value}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            aria-label={`Exibir dados dos últimos ${period.label}`}
            onClick={() => onChange(period.value)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              selected
                ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <span className="sm:hidden">{period.shortLabel}</span>
            <span className="hidden sm:inline">{period.label}</span>
          </button>
        );
      })}
    </div>
  );
}
