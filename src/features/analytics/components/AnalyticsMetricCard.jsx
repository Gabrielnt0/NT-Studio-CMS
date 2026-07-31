import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

const accents = {
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
};

function formatValue(value) {
  if (typeof value === "number") return new Intl.NumberFormat("pt-BR").format(value);
  return value ?? "—";
}

function MiniTrend({ values = [] }) {
  const safeValues = values.map(Number).filter(Number.isFinite).slice(-14);
  if (safeValues.length < 2) return null;

  const width = 120;
  const height = 30;
  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);
  const range = Math.max(max - min, 1);
  const points = safeValues.map((value, index) => {
    const x = (index / (safeValues.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-8 w-full opacity-70" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsMetricCard({ label, value, helper, icon: Icon, change, accent = "blue", trend = [] }) {
  const numericChange = Number(change);
  const hasChange = Number.isFinite(numericChange);
  const ChangeIcon = numericChange > 0 ? ArrowUpRight : numericChange < 0 ? ArrowDownRight : Minus;
  const changeClass = numericChange > 0 ? "text-emerald-400" : numericChange < 0 ? "text-red-400" : "text-zinc-500";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/70 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <strong className="mt-2 block truncate text-3xl font-bold tracking-tight text-white">{formatValue(value)}</strong>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {hasChange && <span className={`inline-flex items-center gap-1 font-semibold ${changeClass}`}><ChangeIcon size={14} />{Math.abs(numericChange).toFixed(1)}%</span>}
            {helper && <span className="text-zinc-500">{helper}</span>}
          </div>
        </div>
        {Icon && <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition group-hover:scale-105 ${accents[accent] ?? accents.blue}`}><Icon size={21} /></span>}
      </div>
      <MiniTrend values={trend} />
    </article>
  );
}
