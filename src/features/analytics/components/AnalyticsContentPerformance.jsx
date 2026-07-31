import { Eye, FileText, TrendingUp, Users } from "lucide-react";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(toNumber(value));
}

function getPageLabel(row, index) {
  return row?.title || row?.page || row?.path || `Página ${index + 1}`;
}

function getPagePath(row) {
  return row?.page || row?.path || "Caminho não informado";
}

export default function AnalyticsContentPerformance({ rows = [] }) {
  const pages = Array.isArray(rows) ? rows.slice(0, 5) : [];
  const maxViews = Math.max(...pages.map((row) => toNumber(row?.views ?? row?.screenPageViews)), 1);
  const totalViews = pages.reduce((sum, row) => sum + toNumber(row?.views ?? row?.screenPageViews), 0);
  const totalUsers = pages.reduce((sum, row) => sum + toNumber(row?.activeUsers ?? row?.users), 0);
  const leader = pages[0];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Desempenho de conteúdo</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Páginas que mais geram atenção</h2>
          <p className="mt-1 text-sm text-zinc-500">Ranking visual das páginas com maior volume de visualizações.</p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300">
          <TrendingUp size={13} /> Top 5 páginas
        </span>
      </div>

      {pages.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">Nenhuma página registrada no período.</div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500"><Eye size={14} /> Visualizações no Top 5</div>
              <p className="mt-2 text-xl font-semibold text-white">{formatNumber(totalViews)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500"><Users size={14} /> Utilizadores no Top 5</div>
              <p className="mt-2 text-xl font-semibold text-white">{formatNumber(totalUsers)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500"><FileText size={14} /> Conteúdo líder</div>
              <p className="mt-2 truncate text-sm font-semibold text-white" title={getPageLabel(leader, 0)}>{getPageLabel(leader, 0)}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {pages.map((row, index) => {
              const views = toNumber(row?.views ?? row?.screenPageViews);
              const users = toNumber(row?.activeUsers ?? row?.users);
              const width = Math.max(4, (views / maxViews) * 100);
              return (
                <div key={`${getPagePath(row)}-${index}`}>
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-200" title={getPageLabel(row, index)}>{index + 1}. {getPageLabel(row, index)}</p>
                      <p className="truncate text-xs text-zinc-600" title={getPagePath(row)}>{getPagePath(row)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-white">{formatNumber(views)}</p>
                      <p className="text-xs text-zinc-500">{formatNumber(users)} utilizadores</p>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-blue-500/70 transition-all" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
