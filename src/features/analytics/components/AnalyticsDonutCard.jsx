const PALETTE = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#06b6d4",
  "#ef4444",
];

const numberFormatter = new Intl.NumberFormat("pt-BR");

function buildGradient(rows, valueKey) {
  const total = rows.reduce(
    (sum, row) => sum + Number(row?.[valueKey] ?? 0),
    0,
  );

  if (total <= 0) return "#27272a 0% 100%";

  let cursor = 0;
  return rows
    .slice(0, 6)
    .map((row, index) => {
      const start = cursor;
      cursor += (Number(row?.[valueKey] ?? 0) / total) * 100;
      return `${PALETTE[index % PALETTE.length]} ${start}% ${cursor}%`;
    })
    .join(", ");
}

export default function AnalyticsDonutCard({
  title,
  description,
  rows = [],
  labelKey,
  valueKey = "activeUsers",
  emptyMessage,
}) {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const visibleRows = normalizedRows.slice(0, 6);
  const total = normalizedRows.reduce(
    (sum, row) => sum + Number(row?.[valueKey] ?? 0),
    0,
  );
  const gradient = buildGradient(visibleRows, valueKey);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}

      {visibleRows.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center text-center text-sm text-zinc-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-[160px_1fr] sm:items-center">
          <div
            className="relative mx-auto h-36 w-36 rounded-full shadow-[0_0_45px_rgba(59,130,246,0.08)]"
            style={{ background: `conic-gradient(${gradient})` }}
          >
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
              <strong className="text-2xl text-white">
                {numberFormatter.format(total)}
              </strong>
              <span className="text-[11px] uppercase tracking-wider text-zinc-600">
                total
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {visibleRows.map((row, index) => {
              const label = row?.[labelKey] || "Não definido";
              const value = Number(row?.[valueKey] ?? 0);
              const percentage = total > 0 ? (value / total) * 100 : 0;

              return (
                <div key={`${label}-${index}`} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-zinc-400">
                      <i
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                      />
                      <span className="truncate">{label}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-zinc-600">
                        {percentage.toFixed(1)}%
                      </span>
                      <strong className="text-zinc-200">
                        {numberFormatter.format(value)}
                      </strong>
                    </span>
                  </div>

                  <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: PALETTE[index % PALETTE.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
