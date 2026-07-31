import { Activity, Eye, MousePointerClick, Users } from "lucide-react";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatDate(value, index) {
  if (!value) return `Dia ${index + 1}`;
  const compact = String(value);
  const normalized = /^\d{8}$/.test(compact)
    ? `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`
    : compact;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return compact;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date);
}

function changePercent(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function classify(value) {
  if (value >= 15) return { label: "Alta forte", className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" };
  if (value >= 3) return { label: "Em alta", className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" };
  if (value <= -15) return { label: "Queda forte", className: "border-red-500/20 bg-red-500/10 text-red-300" };
  if (value <= -3) return { label: "Em queda", className: "border-amber-500/20 bg-amber-500/10 text-amber-300" };
  return { label: "Estável", className: "border-zinc-700 bg-zinc-800/70 text-zinc-300" };
}

const definitions = [
  { key: "activeUsers", fallback: "users", label: "Usuários", icon: Users },
  { key: "sessions", label: "Sessões", icon: Activity },
  { key: "screenPageViews", fallback: "views", label: "Visualizações", icon: Eye },
  { key: "eventCount", fallback: "events", label: "Eventos", icon: MousePointerClick },
];

export default function AnalyticsHealthTimeline({ rows = [] }) {
  const safeRows = Array.isArray(rows) ? rows.slice(-7) : [];

  const timeline = safeRows.map((row, index) => {
    const previous = index > 0 ? safeRows[index - 1] : null;
    const score = definitions.reduce((total, definition) => {
      const currentValue = toNumber(row?.[definition.key] ?? row?.[definition.fallback]);
      const previousValue = toNumber(previous?.[definition.key] ?? previous?.[definition.fallback]);
      return total + (previous ? changePercent(currentValue, previousValue) : 0);
    }, 0) / definitions.length;
    return { row, date: formatDate(row?.date ?? row?.day, index), score, status: classify(score) };
  });

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Timeline de saúde</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Movimento dos últimos dias</h2>
        <p className="mt-1 text-sm text-zinc-500">Leitura diária combinando utilizadores, sessões, visualizações e eventos.</p>
      </div>

      {timeline.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">Ainda não há dados diários suficientes.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {timeline.map((item, index) => (
            <div key={`${item.date}-${index}`} className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400"><Activity size={16} /></span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{item.date}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {definitions.map((definition) => `${definition.label}: ${toNumber(item.row?.[definition.key] ?? item.row?.[definition.fallback]).toLocaleString("pt-BR")}`).join(" · ")}
                  </p>
                </div>
              </div>
              <span className={`self-start rounded-full border px-3 py-1 text-xs font-medium sm:self-auto ${item.status.className}`}>
                {item.score > 0 ? "+" : ""}{item.score.toFixed(1)}% · {item.status.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
