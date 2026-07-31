import { ArrowDown, ArrowUp, BarChart3, Building2, Check, Download, FileText, LayoutDashboard, RotateCcw, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { useAnalyticsWorkspace } from "../hooks/useAnalyticsWorkspace";
import { exportAnalyticsCsv, printAnalyticsReport } from "../utils/analyticsEnterpriseExport";

const WIDGETS = {
  sessions: { label: "Sessões", value: (metrics) => metrics.sessions || 0, helper: "visitas no período" },
  users: { label: "Usuários ativos", value: (metrics) => metrics.activeUsers || 0, helper: "pessoas alcançadas" },
  views: { label: "Visualizações", value: (metrics) => metrics.screenPageViews || 0, helper: "páginas e ecrãs" },
  events: { label: "Eventos", value: (metrics) => metrics.eventCount || 0, helper: "interações registadas" },
  engagement: { label: "Engajamento", value: (metrics) => `${Number(metrics.engagementRate || 0).toFixed(1)}%`, helper: "taxa de envolvimento" },
  conversions: { label: "Conversões", value: (metrics) => metrics.conversions || metrics.keyEvents || 0, helper: "eventos principais" },
};

function percentChange(current, previous) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export default function AnalyticsEnterpriseWorkspace({ metrics, project, projects, periodDays }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [compareProjectId, setCompareProjectId] = useState("");
  const [exportError, setExportError] = useState("");
  const workspace = useAnalyticsWorkspace(project?.id, metrics, project?.name);
  const comparisonSnapshot = workspace.snapshots[compareProjectId];
  const compareOptions = useMemo(() => projects.filter((item) => item.id !== project?.id), [project?.id, projects]);

  const handlePrint = () => {
    setExportError("");
    try {
      printAnalyticsReport({ metrics, projectName: project?.name, periodDays, branding: workspace.branding });
    } catch (error) {
      setExportError(error.message);
    }
  };

  return <Card className="overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400"><LayoutDashboard size={21} /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-white">Workspace Enterprise</h2><span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-300">Sprint 17</span></div><p className="mt-1 text-sm text-zinc-400">Dashboard configurável, marca branca, comparação e exportações persistentes.</p></div></div>
      <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={() => exportAnalyticsCsv({ metrics, projectName: project?.name, periodDays })}><Download size={15} /> Excel/CSV</Button><Button variant="secondary" size="sm" onClick={handlePrint}><FileText size={15} /> PDF</Button><Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}><Settings2 size={15} /> Personalizar</Button></div>
    </div>

    {exportError && <div className="mx-5 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{exportError}</div>}

    <div className="p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{workspace.branding.companyName}</p><h3 className="mt-1 text-lg font-semibold text-white">{workspace.branding.reportTitle}</h3></div><div className="flex items-center gap-2 text-xs text-zinc-500"><Check size={14} className="text-emerald-400" /> Preferências guardadas neste navegador</div></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{workspace.widgets.map((widgetId) => { const widget = WIDGETS[widgetId]; if (!widget) return null; return <div key={widgetId} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"><div className="flex items-center justify-between"><span className="text-sm text-zinc-400">{widget.label}</span><BarChart3 size={16} className="text-zinc-600" /></div><p className="mt-3 text-2xl font-semibold text-white">{widget.value(metrics)}</p><p className="mt-1 text-xs text-zinc-500">{widget.helper}</p></div>; })}</div>
    </div>

    <div className="border-t border-zinc-800 p-5"><div className="mb-4 flex items-center gap-3"><Building2 size={18} className="text-blue-400" /><div><h3 className="font-medium text-white">Comparação entre projetos</h3><p className="text-xs text-zinc-500">A comparação fica disponível após cada projeto ser aberto pelo menos uma vez.</p></div></div><select value={compareProjectId} onChange={(event) => setCompareProjectId(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-blue-500 md:max-w-md"><option value="">Selecionar projeto de referência</option>{compareOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{compareProjectId && !comparisonSnapshot && <p className="mt-3 text-sm text-amber-300">Abra esse projeto no seletor principal para guardar a primeira referência.</p>}{comparisonSnapshot && <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Sessões", "sessions"], ["Usuários", "activeUsers"], ["Visualizações", "screenPageViews"], ["Eventos", "eventCount"]].map(([label, key]) => { const current = Number(metrics[key] || 0); const previous = Number(comparisonSnapshot.metrics[key] || 0); const change = percentChange(current, previous); return <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"><p className="text-xs text-zinc-500">{label} vs. {comparisonSnapshot.projectName}</p><p className="mt-2 text-xl font-semibold text-white">{current.toLocaleString("pt-BR")}</p><p className={`mt-1 text-xs ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>{change >= 0 ? "+" : ""}{change.toFixed(1)}%</p></div>; })}</div>}</div>

    {settingsOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={() => setSettingsOpen(false)}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-zinc-800 p-5"><div><h3 className="font-semibold text-white">Personalizar workspace</h3><p className="mt-1 text-sm text-zinc-500">Escolha widgets, ordem e identidade do relatório.</p></div><button type="button" onClick={() => setSettingsOpen(false)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white"><X size={18} /></button></div><div className="space-y-6 p-5"><div><h4 className="mb-3 text-sm font-medium text-white">Marca branca</h4><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-zinc-500">Nome da empresa<input value={workspace.branding.companyName} onChange={(event) => workspace.updateBranding({ companyName: event.target.value })} className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" /></label><label className="text-xs text-zinc-500">Título do relatório<input value={workspace.branding.reportTitle} onChange={(event) => workspace.updateBranding({ reportTitle: event.target.value })} className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" /></label></div><label className="mt-3 flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={workspace.branding.showPoweredBy} onChange={(event) => workspace.updateBranding({ showPoweredBy: event.target.checked })} /> Exibir “Gerado pelo NT Studio CMS”</label></div><div><h4 className="mb-3 text-sm font-medium text-white">Widgets visíveis e ordem</h4><div className="space-y-2">{Object.entries(WIDGETS).map(([id, widget]) => { const active = workspace.widgets.includes(id); const index = workspace.widgets.indexOf(id); return <div key={id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 p-3"><label className="flex items-center gap-3 text-sm text-zinc-200"><input type="checkbox" checked={active} onChange={() => workspace.toggleWidget(id)} />{widget.label}</label><div className="flex gap-1"><button type="button" disabled={!active || index <= 0} onClick={() => workspace.moveWidget(id, -1)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30"><ArrowUp size={15} /></button><button type="button" disabled={!active || index >= workspace.widgets.length - 1} onClick={() => workspace.moveWidget(id, 1)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30"><ArrowDown size={15} /></button></div></div>; })}</div></div></div><div className="flex flex-col-reverse gap-2 border-t border-zinc-800 p-5 sm:flex-row sm:justify-between"><Button variant="ghost" onClick={workspace.resetWorkspace}><RotateCcw size={15} /> Restaurar padrão</Button><Button onClick={() => setSettingsOpen(false)}>Guardar e fechar</Button></div></div></div>}
  </Card>;
}
