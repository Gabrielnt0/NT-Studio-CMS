export default function AnalyticsBreakdownCard({ title, description, rows = [], labelKey, valueKey = "activeUsers", emptyMessage }) {
  const max = Math.max(...rows.map((row) => Number(row[valueKey] ?? 0)), 1);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      {rows.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center text-center text-sm text-zinc-500">{emptyMessage}</div>
      ) : (
        <div className="mt-5 space-y-4">
          {rows.slice(0, 8).map((row, index) => {
            const value = Number(row[valueKey] ?? 0);
            return (
              <div key={`${row[labelKey]}-${index}`}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-zinc-300">{row[labelKey] || "Não definido"}</span>
                  <strong className="text-zinc-100">{new Intl.NumberFormat("pt-BR").format(value)}</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${Math.max((value / max) * 100, 3)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
