import { Activity, Clock3, Eye, MousePointerClick, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { ContentErrorState, ContentPageHeader } from "../../../components/content";
import Button from "../../../components/ui/Button";
import AnalyticsAcquisitionOverview from "../components/AnalyticsAcquisitionOverview";
import AnalyticsAIAnalyst from "../components/AnalyticsAIAnalyst";
import AnalyticsAIForecast from "../components/AnalyticsAIForecast";
import AnalyticsAnomalyTimeline from "../components/AnalyticsAnomalyTimeline";
import AnalyticsBrowserCard from "../components/AnalyticsBrowserCard";
import AnalyticsDonutCard from "../components/AnalyticsDonutCard";
import AnalyticsContentPerformance from "../components/AnalyticsContentPerformance";
import AnalyticsClarityDashboard from "../components/AnalyticsClarityDashboard";
import AnalyticsConversionsAdvanced from "../components/AnalyticsConversionsAdvanced";
import AnalyticsExecutiveSummary from "../components/AnalyticsExecutiveSummary";
import AnalyticsEnterpriseWorkspace from "../components/AnalyticsEnterpriseWorkspace";
import AnalyticsFunnelCard from "../components/AnalyticsFunnelCard";
import AnalyticsGeoCard from "../components/AnalyticsGeoCard";
import AnalyticsGoalsCard from "../components/AnalyticsGoalsCard";
import AnalyticsHealthScore from "../components/AnalyticsHealthScore";
import AnalyticsHealthTimeline from "../components/AnalyticsHealthTimeline";
import AnalyticsKpiComparison from "../components/AnalyticsKpiComparison";
import AnalyticsInsightsPanel from "../components/AnalyticsInsightsPanel";
import AnalyticsMetricCard from "../components/AnalyticsMetricCard";
import AnalyticsMarketingDashboard from "../components/AnalyticsMarketingDashboard";
import AnalyticsPeriodSelector from "../components/AnalyticsPeriodSelector";
import AnalyticsPerformanceScore from "../components/AnalyticsPerformanceScore";
import AnalyticsReportActions from "../components/AnalyticsReportActions";
import AnalyticsRecommendations from "../components/AnalyticsRecommendations";
import AnalyticsRealtimeEnterprise from "../components/AnalyticsRealtimeEnterprise";
import AnalyticsSessionOverview from "../components/AnalyticsSessionOverview";
import AnalyticsSeoDashboard from "../components/AnalyticsSeoDashboard";
import AnalyticsSkeleton from "../components/AnalyticsSkeleton";
import AnalyticsStatusCard from "../components/AnalyticsStatusCard";
import AnalyticsSyncStatus from "../components/AnalyticsSyncStatus";
import AnalyticsTable from "../components/AnalyticsTable";
import AnalyticsTrendChart from "../components/AnalyticsTrendChart";
import { useAnalytics } from "../hooks/useAnalytics";
import { createAnalyticsIntelligence } from "../utils/analyticsIntelligence";

function formatDate(value) { if (!value) return "Nunca"; return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)); }

export default function AnalyticsPage() {
  const { overview, periodDays, isLoading, isSyncing, isTesting, error, notice, reloadAnalytics, changePeriod, sync, testConnection } = useAnalytics();
  if (isLoading && !overview) return <AnalyticsSkeleton />;
  if (error && !overview) return <ContentErrorState title="Não foi possível carregar o Analytics" onRetry={reloadAnalytics} />;

  const integration = overview?.integration;
  const metrics = overview?.metrics ?? {};
  const connected = integration?.connection_status === "connected";
  const comparison = metrics.comparison ?? {};
  const intelligence = createAnalyticsIntelligence(metrics, { connected, periodDays });

  return <div className="space-y-6">
    <ContentPageHeader eyebrow="Inteligência do portfólio" title="Analytics Premium" description="Acompanhe audiência, conteúdo e aquisição com dados reais do Google Analytics 4." action={<div className="flex flex-wrap items-center gap-3"><AnalyticsPeriodSelector value={periodDays} onChange={changePeriod} disabled={isSyncing || !integration} /><Button variant="secondary" onClick={() => reloadAnalytics()} disabled={isLoading}><RefreshCw size={17} className={isLoading ? "animate-spin" : ""} /> Atualizar</Button><Button onClick={sync} disabled={isSyncing || !integration}><RefreshCw size={17} className={isSyncing ? "animate-spin" : ""} />{isSyncing ? "Sincronizando..." : "Sincronizar"}</Button></div>} />

    <section className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 to-zinc-950 p-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-medium text-white">Meu Portfólio</p><p className="mt-1 text-xs text-zinc-500">Uma única propriedade do Google Analytics, configurada em Configurações.</p></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><AnalyticsReportActions metrics={metrics} projectName="Meu Portfólio" periodDays={periodDays} /><AnalyticsSyncStatus lastSyncedAt={integration?.last_synced_at} connected={connected} /></div></section>

    {(notice || error) && <div className={`rounded-xl border px-4 py-3 text-sm ${error ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"}`}>{error?.message || notice}</div>}

    <AnalyticsAIAnalyst intelligence={intelligence} connected={connected} />

    <AnalyticsPerformanceScore intelligence={intelligence} />

    <AnalyticsEnterpriseWorkspace key="portfolio" metrics={metrics} project={overview?.selectedProject} projects={overview?.projects ?? []} periodDays={periodDays} />

    <AnalyticsExecutiveSummary metrics={metrics} periodDays={periodDays} />

    <AnalyticsHealthScore metrics={metrics} connected={connected} />

    <section className="grid gap-4 md:grid-cols-3"><AnalyticsStatusCard title="Google Analytics 4" description={integration ? `Property ID: ${integration.config?.propertyId ?? "não informado"}` : "Integração ainda não configurada."} status={connected ? "connected" : integration?.connection_status === "error" ? "error" : "pending"} detail={`Última sincronização: ${formatDate(integration?.last_synced_at)}`} /><AnalyticsStatusCard title="Edge Function segura" description="As credenciais permanecem protegidas nos Secrets do Supabase." status={integration ? "connected" : "pending"} detail="Nenhuma credencial é enviada ao navegador." /><AnalyticsStatusCard title="Dados no CMS" description={connected ? "Métricas reais disponíveis para análise e histórico." : "Teste a conexão para liberar os dados reais."} status={connected ? "connected" : "pending"} detail={`Janela atual: ${periodDays} dias`} /></section>

    {!connected && integration && <section className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 md:flex-row md:items-center"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 text-amber-400" size={22} /><div><h2 className="font-semibold text-white">Confirme a conexão</h2><p className="mt-1 text-sm text-zinc-400">A integração existe, mas ainda precisa ser validada para este projeto.</p></div></div><Button variant="secondary" onClick={testConnection} disabled={isTesting}>{isTesting ? "Testando..." : "Testar conexão"}</Button></section>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><AnalyticsMetricCard label="Usuários" value={metrics.activeUsers ?? 0} helper="vs. período anterior" icon={Users} change={comparison.activeUsers} accent="blue" trend={(metrics.daily ?? []).map((row) => row.activeUsers)} /><AnalyticsMetricCard label="Sessões" value={metrics.sessions ?? 0} helper="vs. período anterior" icon={Activity} change={comparison.sessions} accent="emerald" trend={(metrics.daily ?? []).map((row) => row.sessions)} /><AnalyticsMetricCard label="Visualizações" value={metrics.screenPageViews ?? 0} helper="vs. período anterior" icon={Eye} change={comparison.screenPageViews} accent="violet" trend={(metrics.daily ?? []).map((row) => row.screenPageViews)} /><AnalyticsMetricCard label="Eventos" value={metrics.eventCount ?? 0} helper="vs. período anterior" icon={MousePointerClick} change={comparison.eventCount} accent="amber" trend={(metrics.daily ?? []).map((row) => row.eventCount)} /><AnalyticsMetricCard label="Duração média" value={metrics.averageSessionDurationFormatted ?? "0m 00s"} helper="por sessão" icon={Clock3} change={comparison.averageSessionDuration} accent="cyan" /></section>

    <AnalyticsSessionOverview metrics={metrics} />

    <AnalyticsRealtimeEnterprise metrics={metrics} connected={connected} lastSyncedAt={integration?.last_synced_at} onRefresh={reloadAnalytics} isRefreshing={isLoading} />

    <AnalyticsTrendChart rows={metrics.daily ?? []} comparison={comparison} />

    <AnalyticsAIForecast intelligence={intelligence} />

    <AnalyticsFunnelCard metrics={metrics} />

    <AnalyticsConversionsAdvanced metrics={metrics} periodDays={periodDays} />

    <AnalyticsSeoDashboard metrics={metrics} integration={integration} periodDays={periodDays} />

    <AnalyticsMarketingDashboard metrics={metrics} integration={integration} periodDays={periodDays} />

    <AnalyticsClarityDashboard metrics={metrics} integration={integration} periodDays={periodDays} />

    <AnalyticsInsightsPanel metrics={metrics} connected={connected} />

    <section className="grid gap-6 xl:grid-cols-2"><AnalyticsKpiComparison metrics={metrics} /><AnalyticsRecommendations metrics={metrics} connected={connected} /></section>

    <section className="grid gap-6 xl:grid-cols-2"><AnalyticsGoalsCard metrics={metrics} periodDays={periodDays} /><AnalyticsAnomalyTimeline metrics={metrics} /></section>

    <AnalyticsHealthTimeline rows={metrics.daily ?? []} />

    <section className="grid gap-6 xl:grid-cols-2"><AnalyticsContentPerformance rows={metrics.topPages ?? []} /><AnalyticsAcquisitionOverview sources={metrics.trafficSources ?? []} devices={metrics.devices ?? []} /></section>

    <section className="grid gap-6 xl:grid-cols-3"><AnalyticsGeoCard rows={metrics.countries ?? []} /><AnalyticsDonutCard title="Dispositivos" description="Desktop, mobile e tablet" rows={metrics.devices ?? []} labelKey="device" emptyMessage="Nenhum dispositivo registrado." /><AnalyticsBrowserCard rows={metrics.browsers ?? []} /></section>

    <section className="grid gap-6 xl:grid-cols-2"><AnalyticsTable title="Fontes de tráfego" description="Canais que trouxeram visitantes" exportName="fontes-de-trafego" columns={[{ key: "source", label: "Origem" }, { key: "sessions", label: "Sessões", align: "right" }, { key: "activeUsers", label: "Usuários", align: "right" }]} rows={metrics.trafficSources ?? []} emptyMessage="Nenhuma origem registrada." /><AnalyticsTable title="Landing pages" description="Primeiras páginas acessadas" exportName="landing-pages" columns={[{ key: "page", label: "Página" }, { key: "sessions", label: "Sessões", align: "right" }]} rows={metrics.landingPages ?? []} emptyMessage="Nenhuma landing page registrada." /></section>

    <AnalyticsTable title="Páginas mais acessadas" description="Conteúdo com maior volume de visualizações" exportName="paginas-mais-acessadas" columns={[{ key: "title", label: "Título" }, { key: "page", label: "Caminho" }, { key: "views", label: "Visualizações", align: "right" }, { key: "activeUsers", label: "Usuários", align: "right" }]} rows={metrics.topPages ?? []} emptyMessage="Nenhuma página registrada no período." />
  </div>;
}
