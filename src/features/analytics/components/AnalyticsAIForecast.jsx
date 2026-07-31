import { ArrowDownRight, ArrowUpRight, CalendarClock, CircleAlert } from "lucide-react";

function sparkline(values = []) {
  if (!values.length) return "";
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  return values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${36 - ((value - min) / range) * 30}`).join(" ");
}

export default function AnalyticsAIForecast({ intelligence }) {
  const forecast = intelligence?.forecast ?? { values: [], change: 0, direction: "up" };
  const anomalies = intelligence?.anomalies ?? [];
  const ForecastIcon = forecast.direction === "up" ? ArrowUpRight : ArrowDownRight;

  return <section className="grid gap-6 xl:grid-cols-2">
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"><div className="flex items-start justify-between"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300"><CalendarClock size={19} /></span><div><h2 className="font-semibold text-white">Previsão de sessões</h2><p className="mt-1 text-xs text-zinc-500">Projeção linear para os próximos 7 dias</p></div></div><span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${forecast.direction === "up" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}><ForecastIcon size={14} />{Math.abs(forecast.change).toFixed(1).replace(".0", "")}%</span></div><div className="mt-5 h-24 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"><svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none"><polyline points={sparkline(forecast.values)} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" className="text-cyan-400" /></svg></div><div className="mt-3 grid grid-cols-7 gap-1">{forecast.values.map((value, index) => <div key={index} className="text-center"><p className="text-xs font-medium text-zinc-300">{value.toLocaleString("pt-BR")}</p><p className="mt-0.5 text-[10px] text-zinc-600">D+{index + 1}</p></div>)}</div></article>

    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300"><CircleAlert size={19} /></span><div><h2 className="font-semibold text-white">Deteção de anomalias</h2><p className="mt-1 text-xs text-zinc-500">Dias fora do comportamento habitual das sessões</p></div></div><div className="mt-5 space-y-2">{anomalies.length ? anomalies.map((item, index) => <div key={`${item.date}-${index}`} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3"><div><p className="text-sm font-medium text-zinc-200">{item.date}</p><p className="mt-0.5 text-xs text-zinc-500">{item.value.toLocaleString("pt-BR")} sessões</p></div><span className={`rounded-full px-2.5 py-1 text-xs ${item.direction === "up" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>{item.direction === "up" ? "+" : ""}{item.difference.toFixed(1).replace(".0", "")}%</span></div>) : <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4 text-sm text-emerald-300">Nenhuma anomalia relevante foi encontrada no período.</div>}</div></article>
  </section>;
}
