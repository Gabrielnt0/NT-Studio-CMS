import { BarChart3, Download, ExternalLink, MousePointerClick, Search, TrendingUp } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const decimalFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function downloadCsv(rows, filename) {
  const header = ["Consulta", "Cliques", "Impressões", "CTR", "Posição"];
  const body = rows.map((row) => [row.query, row.clicks, row.impressions, `${percentFormatter.format(row.ctr)}%`, decimalFormatter.format(row.position)]);
  const csv = [header, ...body]
    .map((columns) => columns.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-300"><Icon size={17} /></span>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </div>
  );
}

function Ranking({ title, rows, labelKey }) {
  const maximum = Math.max(...rows.map((row) => toNumber(row.clicks)), 1);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-7 text-center text-xs text-zinc-500">Nenhum dado de Search Console disponível.</p>}
        {rows.slice(0, 6).map((row, index) => (
          <div key={`${row[labelKey]}-${index}`}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-zinc-300">{row[labelKey]}</span>
              <span className="shrink-0 font-medium text-white">{numberFormatter.format(row.clicks)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-blue-400/80" style={{ width: `${Math.max((row.clicks / maximum) * 100, row.clicks > 0 ? 4 : 0)}%` }} /></div>
            <p className="mt-1 text-[11px] text-zinc-600">{numberFormatter.format(row.impressions)} impressões · {percentFormatter.format(row.ctr)}% CTR · posição {decimalFormatter.format(row.position)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsSeoDashboard({ metrics = {}, integration = null, periodDays = 30 }) {
  const seo = metrics.seo ?? metrics.searchConsole ?? {};
  const queries = (seo.queries ?? metrics.seoQueries ?? []).map((row) => ({
    query: row.query ?? row.keyword ?? row.term ?? "Consulta não identificada",
    clicks: toNumber(row.clicks),
    impressions: toNumber(row.impressions),
    ctr: toNumber(row.ctr),
    position: toNumber(row.position ?? row.averagePosition),
  })).sort((a, b) => b.clicks - a.clicks);
  const pages = (seo.pages ?? metrics.seoPages ?? []).map((row) => ({
    page: row.page ?? row.url ?? row.path ?? "Página não identificada",
    clicks: toNumber(row.clicks),
    impressions: toNumber(row.impressions),
    ctr: toNumber(row.ctr),
    position: toNumber(row.position ?? row.averagePosition),
  })).sort((a, b) => b.clicks - a.clicks);

  const clicks = toNumber(seo.clicks ?? metrics.seoClicks);
  const impressions = toNumber(seo.impressions ?? metrics.seoImpressions);
  const ctr = toNumber(seo.ctr ?? metrics.seoCtr) || (impressions > 0 ? (clicks / impressions) * 100 : 0);
  const position = toNumber(seo.position ?? seo.averagePosition ?? metrics.seoAveragePosition);
  const connected = Boolean(seo.connected ?? metrics.searchConsoleConnected ?? integration?.config?.searchConsoleProperty);
  const hasData = clicks > 0 || impressions > 0 || queries.length > 0 || pages.length > 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-300"><Search size={18} /></span>
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Sprint 13</p><h2 className="text-lg font-semibold text-white">SEO Dashboard</h2></div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">Consultas, páginas e desempenho orgânico preparados para dados do Google Search Console.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1.5 text-xs ${connected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>{connected ? "Search Console conectado" : "Integração pendente"}</span>
          <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">{periodDays} dias</span>
          <button type="button" onClick={() => downloadCsv(queries, "seo-consultas.csv")} disabled={queries.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"><Download size={15} /> Exportar CSV</button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={MousePointerClick} label="Cliques orgânicos" value={numberFormatter.format(clicks)} helper="Visitas vindas da pesquisa" />
        <Metric icon={BarChart3} label="Impressões" value={numberFormatter.format(impressions)} helper="Exibições nos resultados" />
        <Metric icon={TrendingUp} label="CTR médio" value={`${percentFormatter.format(ctr)}%`} helper="Cliques por impressão" />
        <Metric icon={ExternalLink} label="Posição média" value={position > 0 ? decimalFormatter.format(position) : "—"} helper="Ranking médio no Google" />
      </div>

      {!hasData && (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-medium text-amber-200">O painel SEO está pronto, mas ainda não recebeu dados reais.</p>
          <p className="mt-1 text-xs leading-5 text-amber-200/60">Conecte o Google Search Console e envie os campos seo, seoQueries ou seoPages no snapshot da integração. Nenhuma métrica é simulada.</p>
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Ranking title="Principais consultas" rows={queries} labelKey="query" />
        <Ranking title="Páginas orgânicas" rows={pages} labelKey="page" />
      </div>
    </section>
  );
}
