import { BadgeDollarSign, Download, Megaphone, MousePointerClick, Percent, Target, TrendingUp, WalletCards } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeDivide(value, divisor) {
  return divisor > 0 ? value / divisor : 0;
}

function downloadCsv(rows) {
  const header = ["Campanha", "Canal", "Investimento", "Receita", "Conversões", "Cliques", "Impressões", "ROAS", "CPA"];
  const body = rows.map((row) => [row.name, row.channel, row.spend, row.revenue, row.conversions, row.clicks, row.impressions, row.roas, row.cpa]);
  const csv = [header, ...body]
    .map((columns) => columns.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "marketing-campanhas.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300"><Icon size={17} /></span>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </div>
  );
}

function ChannelRanking({ rows }) {
  const maximum = Math.max(...rows.map((row) => row.revenue), 1);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <h3 className="text-sm font-semibold text-white">Desempenho por canal</h3>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-7 text-center text-xs text-zinc-500">Nenhum canal de mídia conectado.</p>}
        {rows.slice(0, 6).map((row, index) => (
          <div key={`${row.channel}-${index}`}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-zinc-300">{row.channel}</span>
              <span className="shrink-0 font-medium text-white">{currencyFormatter.format(row.revenue)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-fuchsia-400/80" style={{ width: `${Math.max((row.revenue / maximum) * 100, row.revenue > 0 ? 4 : 0)}%` }} /></div>
            <p className="mt-1 text-[11px] text-zinc-600">{currencyFormatter.format(row.spend)} investidos · ROAS {decimalFormatter.format(row.roas)}x · {numberFormatter.format(row.conversions)} conversões</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50">
      <div className="border-b border-zinc-800 px-4 py-3"><h3 className="text-sm font-semibold text-white">Campanhas</h3></div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-500"><tr><th className="px-4 py-3 font-medium">Campanha</th><th className="px-4 py-3 font-medium">Canal</th><th className="px-4 py-3 text-right font-medium">Investimento</th><th className="px-4 py-3 text-right font-medium">Receita</th><th className="px-4 py-3 text-right font-medium">ROAS</th><th className="px-4 py-3 text-right font-medium">CPA</th></tr></thead>
          <tbody className="divide-y divide-zinc-800/80">
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-zinc-500">Nenhuma campanha disponível.</td></tr>}
            {rows.slice(0, 10).map((row, index) => <tr key={`${row.name}-${index}`} className="text-zinc-300"><td className="max-w-64 truncate px-4 py-3 font-medium text-white">{row.name}</td><td className="px-4 py-3">{row.channel}</td><td className="px-4 py-3 text-right">{currencyFormatter.format(row.spend)}</td><td className="px-4 py-3 text-right">{currencyFormatter.format(row.revenue)}</td><td className="px-4 py-3 text-right">{decimalFormatter.format(row.roas)}x</td><td className="px-4 py-3 text-right">{currencyFormatter.format(row.cpa)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AnalyticsMarketingDashboard({ metrics = {}, integration = null, periodDays = 30 }) {
  const marketing = metrics.marketing ?? {};
  const campaigns = (marketing.campaigns ?? metrics.marketingCampaigns ?? []).map((row) => {
    const spend = toNumber(row.spend ?? row.cost);
    const revenue = toNumber(row.revenue ?? row.conversionValue);
    const conversions = toNumber(row.conversions ?? row.results);
    return {
      name: row.name ?? row.campaign ?? "Campanha não identificada",
      channel: row.channel ?? row.platform ?? row.source ?? "Canal não identificado",
      spend,
      revenue,
      conversions,
      clicks: toNumber(row.clicks),
      impressions: toNumber(row.impressions),
      roas: toNumber(row.roas) || safeDivide(revenue, spend),
      cpa: toNumber(row.cpa) || safeDivide(spend, conversions),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const channelSource = marketing.channels ?? metrics.marketingChannels ?? [];
  const channels = channelSource.map((row) => {
    const spend = toNumber(row.spend ?? row.cost);
    const revenue = toNumber(row.revenue ?? row.conversionValue);
    const conversions = toNumber(row.conversions ?? row.results);
    return { channel: row.channel ?? row.platform ?? row.source ?? "Canal não identificado", spend, revenue, conversions, roas: toNumber(row.roas) || safeDivide(revenue, spend) };
  }).sort((a, b) => b.revenue - a.revenue);

  const spend = toNumber(marketing.spend ?? metrics.marketingSpend) || campaigns.reduce((total, row) => total + row.spend, 0);
  const revenue = toNumber(marketing.revenue ?? metrics.marketingRevenue) || campaigns.reduce((total, row) => total + row.revenue, 0);
  const conversions = toNumber(marketing.conversions ?? metrics.marketingConversions) || campaigns.reduce((total, row) => total + row.conversions, 0);
  const clicks = toNumber(marketing.clicks ?? metrics.marketingClicks) || campaigns.reduce((total, row) => total + row.clicks, 0);
  const impressions = toNumber(marketing.impressions ?? metrics.marketingImpressions) || campaigns.reduce((total, row) => total + row.impressions, 0);
  const roas = toNumber(marketing.roas) || safeDivide(revenue, spend);
  const cpa = toNumber(marketing.cpa) || safeDivide(spend, conversions);
  const ctr = toNumber(marketing.ctr) || safeDivide(clicks * 100, impressions);
  const connected = Boolean(marketing.connected ?? metrics.marketingConnected ?? integration?.config?.marketingConnected);
  const hasData = spend > 0 || revenue > 0 || campaigns.length > 0 || channels.length > 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300"><Megaphone size={18} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-400">Sprint 14</p><h2 className="text-lg font-semibold text-white">Marketing Dashboard</h2></div></div>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">Visão consolidada de campanhas, investimento, receita, conversões e eficiência por canal.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-3 py-1.5 text-xs ${connected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>{connected ? "Mídia conectada" : "Integrações pendentes"}</span><span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">{periodDays} dias</span><button type="button" onClick={() => downloadCsv(campaigns)} disabled={campaigns.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"><Download size={15} /> Exportar CSV</button></div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={WalletCards} label="Investimento" value={currencyFormatter.format(spend)} helper="Valor aplicado em mídia" /><Metric icon={BadgeDollarSign} label="Receita atribuída" value={currencyFormatter.format(revenue)} helper="Valor gerado pelas campanhas" /><Metric icon={TrendingUp} label="ROAS" value={`${decimalFormatter.format(roas)}x`} helper="Receita por real investido" /><Metric icon={Target} label="Conversões" value={numberFormatter.format(conversions)} helper={`CPA ${currencyFormatter.format(cpa)}`} /></div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2"><Metric icon={MousePointerClick} label="Cliques" value={numberFormatter.format(clicks)} helper={`${numberFormatter.format(impressions)} impressões`} /><Metric icon={Percent} label="CTR médio" value={`${decimalFormatter.format(ctr)}%`} helper="Cliques por impressão" /></div>

      {!hasData && <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><p className="text-sm font-medium text-amber-200">O painel de Marketing está pronto, mas ainda não recebeu dados reais.</p><p className="mt-1 text-xs leading-5 text-amber-200/60">Conecte Google Ads, Meta Ads ou TikTok Ads e envie marketing, marketingCampaigns ou marketingChannels no snapshot da integração. Nenhum valor é simulado.</p></div>}

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><ChannelRanking rows={channels} /><CampaignTable rows={campaigns} /></div>
    </section>
  );
}
