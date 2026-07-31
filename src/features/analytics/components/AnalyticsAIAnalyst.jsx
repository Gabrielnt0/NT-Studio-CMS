import { BrainCircuit, CheckCircle2, Lightbulb, Sparkles, TriangleAlert } from "lucide-react";

const tones = {
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/5 text-amber-300",
  info: "border-blue-500/20 bg-blue-500/5 text-blue-300",
};

const icons = { success: CheckCircle2, warning: TriangleAlert, info: Sparkles };

export default function AnalyticsAIAnalyst({ intelligence, connected }) {
  const insights = intelligence?.insights ?? [];
  const recommendations = intelligence?.recommendations ?? [];

  return <section className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-zinc-950 to-blue-500/5">
    <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-5 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><BrainCircuit size={22} /></span>
        <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold text-white">NT AI Analyst</h2><span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-300">Análise automática</span></div><p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-400">{intelligence?.summary}</p></div>
      </div>
      <div className="text-xs text-zinc-500">{connected ? "Dados reais do GA4" : "Aguardando ligação ao GA4"}</div>
    </div>

    <div className="grid gap-5 p-5 xl:grid-cols-[1.35fr_1fr]">
      <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">O que merece atenção</p><div className="grid gap-3 md:grid-cols-2">{insights.length ? insights.map((insight) => { const Icon = icons[insight.type] ?? Sparkles; return <article key={insight.id} className={`rounded-xl border p-4 ${tones[insight.type] ?? tones.info}`}><div className="flex items-start gap-3"><Icon size={18} className="mt-0.5 shrink-0" /><div><h3 className="text-sm font-semibold text-zinc-100">{insight.title}</h3><p className="mt-1 text-xs leading-5 text-zinc-400">{insight.text}</p></div></div></article>; }) : <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-500 md:col-span-2">Ainda não há dados suficientes para gerar insights.</div>}</div></div>
      <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Próximas ações</p><div className="space-y-3">{recommendations.map((item, index) => <article key={`${item.title}-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300"><Lightbulb size={15} /></span><div><div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3><span className={`h-1.5 w-1.5 rounded-full ${item.priority === "high" ? "bg-red-400" : item.priority === "medium" ? "bg-amber-400" : "bg-blue-400"}`} /></div><p className="mt-1 text-xs leading-5 text-zinc-400">{item.text}</p></div></div></article>)}</div></div>
    </div>
  </section>;
}
