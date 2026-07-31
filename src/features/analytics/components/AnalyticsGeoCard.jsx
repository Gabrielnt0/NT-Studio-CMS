import { Globe2 } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export default function AnalyticsGeoCard({ rows = [] }) {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const visibleRows = normalizedRows.slice(0, 7);
  const total = normalizedRows.reduce(
    (sum, row) => sum + Number(row?.activeUsers ?? 0),
    0,
  );
  const max = Math.max(
    ...visibleRows.map((row) => Number(row?.activeUsers ?? 0)),
    1,
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-blue-500/10 bg-blue-500/5" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Globe2 size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-white">Audiência global</h2>
              <p className="text-sm text-zinc-500">Países com mais utilizadores</p>
            </div>
          </div>

          {total > 0 && (
            <div className="text-right">
              <strong className="block text-lg text-white">
                {numberFormatter.format(total)}
              </strong>
              <span className="text-[11px] uppercase tracking-wide text-zinc-600">
                utilizadores
              </span>
            </div>
          )}
        </div>

        {visibleRows.length === 0 ? (
          <div className="flex min-h-52 items-center justify-center text-sm text-zinc-500">
            Nenhum país registado.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibleRows.map((row, index) => {
              const country = row?.country || "Não definido";
              const value = Number(row?.activeUsers ?? 0);
              const percentage = total > 0 ? (value / total) * 100 : 0;
              const width = value > 0 ? Math.max((value / max) * 100, 4) : 0;

              return (
                <div key={`${country}-${index}`}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-zinc-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[10px] font-semibold text-zinc-500">
                        {index + 1}
                      </span>
                      <span className="truncate">{country}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-zinc-600">
                        {percentage.toFixed(1)}%
                      </span>
                      <strong className="min-w-8 text-right text-white">
                        {numberFormatter.format(value)}
                      </strong>
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
