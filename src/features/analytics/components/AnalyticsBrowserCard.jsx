const numberFormatter = new Intl.NumberFormat("pt-BR");

function getBrowserBadge(name) {
  const normalized = String(name || "").toLowerCase();

  if (normalized.includes("chrome")) return "CH";
  if (normalized.includes("safari")) return "SF";
  if (normalized.includes("firefox")) return "FF";
  if (normalized.includes("edge")) return "ED";
  if (normalized.includes("opera")) return "OP";
  if (normalized.includes("samsung")) return "SI";

  return "WEB";
}

function BrowserBadge({ name }) {
  return (
    <span aria-hidden="true" className="text-[10px] font-bold tracking-tight text-zinc-300">
      {getBrowserBadge(name)}
    </span>
  );
}

export default function AnalyticsBrowserCard({ rows = [] }) {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const total = normalizedRows.reduce(
    (sum, row) => sum + Number(row?.activeUsers ?? 0),
    0,
  );
  const visibleRows = normalizedRows.slice(0, 7);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white">Navegadores</h2>
          <p className="mt-1 text-sm text-zinc-500">Tecnologias usadas pela audiência</p>
        </div>

        {total > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-right">
            <strong className="block text-sm text-white">
              {numberFormatter.format(total)}
            </strong>
            <span className="text-[10px] uppercase tracking-wide text-zinc-600">
              utilizadores
            </span>
          </div>
        )}
      </div>

      {visibleRows.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center text-sm text-zinc-500">
          Nenhum navegador identificado.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {visibleRows.map((row, index) => {
            const browserName = row?.browser || "Não definido";
            const value = Number(row?.activeUsers ?? 0);
            const percent = total > 0 ? (value / total) * 100 : 0;
            const barWidth = value > 0 ? Math.max(percent, 4) : 0;

            return (
              <div
                key={`${browserName}-${index}`}
                className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 transition group-hover:bg-zinc-700">
                  <BrowserBadge name={browserName} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate text-zinc-300">{browserName}</span>
                    <strong className="text-white">
                      {numberFormatter.format(value)}
                    </strong>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400 transition-[width] duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                <span className="w-12 text-right text-xs text-zinc-600">
                  {percent.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
