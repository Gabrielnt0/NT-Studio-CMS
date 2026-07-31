import {
  AlertTriangle,
  ArrowDownToLine,
  Braces,
  ChevronRight,
  Flame,
  LayoutDashboard,
  MonitorPlay,
  MousePointerClick,
  ScrollText,
} from "lucide-react";

function number(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value ?? 0));
}

function percent(value) {
  const numeric = Number(value ?? 0);
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(numeric)}%`;
}

function duration(value) {
  const seconds = Math.max(0, Number(value ?? 0));
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}

function downloadCsv(rows) {
  if (!rows.length) return;
  const headers = ["Sessão", "Página", "Dispositivo", "País", "Duração", "Problemas", "URL"];
  const body = rows.map((row) => [
    row.id ?? row.sessionId ?? "",
    row.page ?? row.title ?? "",
    row.device ?? "",
    row.country ?? "",
    row.duration ?? 0,
    row.issues ?? row.problemCount ?? 0,
    row.url ?? row.recordingUrl ?? "",
  ]);
  const csv = [headers, ...body]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "microsoft-clarity-sessoes.csv";
  anchor.click();
  URL.revokeObjectURL(href);
}

function Metric({ icon: Icon, label, value, helper, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
    violet: "bg-violet-500/10 text-violet-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
  };
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
    <div className="flex items-center justify-between gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone] ?? tones.blue}`}><Icon size={18} /></span>
      <span className="text-2xl font-semibold text-white">{value}</span>
    </div>
    <p className="mt-4 text-sm font-medium text-zinc-200">{label}</p>
    <p className="mt-1 text-xs text-zinc-500">{helper}</p>
  </div>;
}

function EmptyState() {
  return <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
    <Flame className="mx-auto text-violet-400" size={30} />
    <h3 className="mt-4 font-semibold text-white">Microsoft Clarity ainda não conectado</h3>
    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-400">O painel está pronto para receber heatmaps, gravações e sinais comportamentais. Nenhuma métrica fictícia será exibida enquanto a integração não fornecer dados reais.</p>
  </div>;
}

export default function AnalyticsClarityDashboard({ metrics = {}, integration, periodDays = 30 }) {
  const clarity = metrics.clarity ?? {};
  const recordings = metrics.clarityRecordings ?? clarity.recordings ?? [];
  const heatmaps = metrics.clarityHeatmaps ?? clarity.heatmaps ?? [];
  const pages = metrics.clarityPages ?? clarity.pages ?? [];
  const connected = Boolean(metrics.clarityConnected ?? clarity.connected ?? integration?.config?.clarityProjectId);
  const sessions = Number(clarity.sessions ?? metrics.claritySessions ?? 0);
  const problemSessions = Number(clarity.problemSessions ?? metrics.clarityProblemSessions ?? 0);
  const rageClicks = Number(clarity.rageClicks ?? metrics.clarityRageClicks ?? 0);
  const deadClicks = Number(clarity.deadClicks ?? metrics.clarityDeadClicks ?? 0);
  const quickBacks = Number(clarity.quickBacks ?? metrics.clarityQuickBacks ?? 0);
  const excessiveScroll = Number(clarity.excessiveScroll ?? metrics.clarityExcessiveScroll ?? 0);
  const jsErrors = Number(clarity.jsErrors ?? metrics.clarityJsErrors ?? 0);
  const averageScrollDepth = Number(clarity.averageScrollDepth ?? metrics.clarityAverageScrollDepth ?? 0);
  const problemRate = sessions > 0 ? (problemSessions / sessions) * 100 : 0;

  return <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
    <header className="flex flex-col gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400"><Flame size={21} /></span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-white">Microsoft Clarity</h2>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${connected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-zinc-700 bg-zinc-800 text-zinc-400"}`}>{connected ? "Conectado" : "Aguardando integração"}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">Comportamento, fricção e gravações de sessão nos últimos {periodDays} dias.</p>
        </div>
      </div>
      <button type="button" onClick={() => downloadCsv(recordings)} disabled={!recordings.length} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-violet-500/50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowDownToLine size={16} /> Exportar sessões</button>
    </header>

    <div className="space-y-6 p-5">
      {!connected && !sessions && recordings.length === 0 && heatmaps.length === 0 ? <EmptyState /> : <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Metric icon={MonitorPlay} label="Sessões analisadas" value={number(sessions)} helper="Sessões processadas pelo Clarity" tone="blue" />
          <Metric icon={AlertTriangle} label="Sessões com problemas" value={percent(problemRate)} helper={`${number(problemSessions)} sessões com fricção`} tone="amber" />
          <Metric icon={MousePointerClick} label="Rage clicks" value={number(rageClicks)} helper="Cliques repetidos em sequência" tone="red" />
          <Metric icon={LayoutDashboard} label="Dead clicks" value={number(deadClicks)} helper="Cliques sem resposta visível" tone="violet" />
          <Metric icon={ScrollText} label="Scroll médio" value={percent(averageScrollDepth)} helper="Profundidade média das páginas" tone="emerald" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="font-semibold text-white">Sinais de fricção</h3>
            <p className="mt-1 text-sm text-zinc-500">Eventos que indicam dificuldade de navegação.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Quick backs", quickBacks, "Retorno rápido à página anterior"],
                ["Scroll excessivo", excessiveScroll, "Rolagem repetida sem encontrar conteúdo"],
                ["Erros JavaScript", jsErrors, "Falhas capturadas durante a sessão"],
                ["Rage clicks", rageClicks, "Cliques repetidos em curto intervalo"],
              ].map(([label, value, helper]) => <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm text-zinc-300">{label}</span><strong className="text-lg text-white">{number(value)}</strong></div><p className="mt-2 text-xs text-zinc-500">{helper}</p></div>)}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="font-semibold text-white">Heatmaps disponíveis</h3>
            <p className="mt-1 text-sm text-zinc-500">Páginas com mapas de clique e rolagem.</p>
            <div className="mt-4 space-y-2">
              {heatmaps.length === 0 ? <p className="rounded-xl border border-dashed border-zinc-800 p-5 text-center text-sm text-zinc-500">Nenhum heatmap sincronizado.</p> : heatmaps.slice(0, 6).map((row, index) => <a key={row.id ?? row.url ?? index} href={row.url ?? row.heatmapUrl ?? "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition hover:border-violet-500/40"><div className="min-w-0"><p className="truncate text-sm font-medium text-zinc-200">{row.title ?? row.page ?? "Página sem título"}</p><p className="mt-1 truncate text-xs text-zinc-500">{row.path ?? row.url ?? "Heatmap disponível"}</p></div><ChevronRight className="shrink-0 text-zinc-600" size={17} /></a>)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="font-semibold text-white">Gravações recentes</h3><p className="mt-1 text-sm text-zinc-500">Sessões com contexto de dispositivo, localização e fricção.</p></div><span className="text-xs text-zinc-500">{number(recordings.length)} gravações carregadas</span></div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500"><tr><th className="px-3 py-3 font-medium">Página</th><th className="px-3 py-3 font-medium">Dispositivo</th><th className="px-3 py-3 font-medium">País</th><th className="px-3 py-3 text-right font-medium">Duração</th><th className="px-3 py-3 text-right font-medium">Problemas</th><th className="px-3 py-3 text-right font-medium">Ação</th></tr></thead>
              <tbody className="divide-y divide-zinc-800/70">
                {recordings.length === 0 ? <tr><td colSpan="6" className="px-3 py-8 text-center text-zinc-500">Nenhuma gravação sincronizada.</td></tr> : recordings.slice(0, 10).map((row, index) => <tr key={row.id ?? row.sessionId ?? index} className="text-zinc-300"><td className="max-w-xs px-3 py-3"><p className="truncate font-medium text-zinc-200">{row.page ?? row.title ?? "Sessão"}</p><p className="mt-1 truncate text-xs text-zinc-600">{row.path ?? row.url ?? ""}</p></td><td className="px-3 py-3">{row.device ?? "—"}</td><td className="px-3 py-3">{row.country ?? "—"}</td><td className="px-3 py-3 text-right tabular-nums">{duration(row.duration)}</td><td className="px-3 py-3 text-right tabular-nums">{number(row.issues ?? row.problemCount)}</td><td className="px-3 py-3 text-right">{row.url || row.recordingUrl ? <a href={row.recordingUrl ?? row.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300">Assistir <ChevronRight size={14} /></a> : <span className="text-zinc-600">Indisponível</span>}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {pages.length > 0 && <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"><h3 className="font-semibold text-white">Páginas com maior fricção</h3><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{pages.slice(0, 6).map((row, index) => <div key={row.path ?? index} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-zinc-200">{row.title ?? row.page ?? row.path ?? "Página"}</p><p className="mt-1 truncate text-xs text-zinc-500">{row.path ?? ""}</p></div><Braces className="shrink-0 text-zinc-600" size={16} /></div><div className="mt-4 flex items-center justify-between text-xs text-zinc-500"><span>{number(row.sessions)} sessões</span><span>{number(row.issues)} problemas</span></div></div>)}</div></div>}
      </>}
    </div>
  </section>;
}
