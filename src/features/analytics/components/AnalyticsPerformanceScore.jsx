import { Activity, BarChart3, Database, Gauge, Target } from "lucide-react";

const dimensionMeta = {
  growth: ["Crescimento", BarChart3],
  engagement: ["Engajamento", Activity],
  conversion: ["Conversão", Target],
  consistency: ["Consistência", Gauge],
  data: ["Qualidade dos dados", Database],
};

const tone = { emerald: "text-emerald-300", blue: "text-blue-300", amber: "text-amber-300", red: "text-red-300" };

export default function AnalyticsPerformanceScore({ intelligence }) {
  const score = intelligence?.score;
  if (!score) return null;

  return <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
      <div className="flex min-w-52 items-center gap-4">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: `conic-gradient(rgb(139 92 246) ${score.total * 3.6}deg, rgb(39 39 42) 0deg)` }}><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-zinc-950"><strong className="text-3xl text-white">{score.total}</strong><span className="text-[10px] uppercase tracking-wider text-zinc-500">de 100</span></div></div>
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Performance score</p><h2 className={`mt-1 text-xl font-semibold ${tone[score.tone]}`}>{score.label}</h2><p className="mt-1 max-w-44 text-xs leading-5 text-zinc-500">Índice composto de crescimento, interação, conversão e estabilidade.</p></div>
      </div>
      <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{Object.entries(score.dimensions).map(([key, value]) => { const [label, Icon] = dimensionMeta[key]; return <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3"><div className="flex items-center justify-between"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300"><Icon size={16} /></span><strong className="text-sm text-zinc-100">{Math.round(value)}</strong></div><p className="mt-3 text-xs text-zinc-400">{label}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.max(3, value)}%` }} /></div></div>; })}</div>
    </div>
  </section>;
}
