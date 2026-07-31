import { ArrowRight, Download, MousePointerClick, Route, Target, Trophy, Users } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function conversionValue(row = {}) {
  return toNumber(row.conversions ?? row.keyEvents ?? row.conversionCount ?? row.goalCompletions);
}

function conversionRate(conversions, base) {
  if (!base || base <= 0) return 0;
  return (conversions / base) * 100;
}

function downloadCsv(rows, filename) {
  const header = ["Dimensão", "Sessões", "Conversões", "Taxa de conversão"];
  const body = rows.map((row) => [
    row.label,
    row.sessions,
    row.conversions,
    `${percentFormatter.format(row.rate)}%`,
  ]);
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

function SummaryCard({ icon: Icon, label, value, helper, accent = "blue" }) {
  const accents = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${accents[accent] ?? accents.blue}`}>
        <Icon size={17} />
      </span>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </div>
  );
}

function Ranking({ title, description, rows, emptyMessage }) {
  const maximum = Math.max(...rows.map((row) => row.conversions), 1);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>

      <div className="mt-4 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-800 px-4 py-7 text-center text-xs text-zinc-500">
            {emptyMessage}
          </div>
        )}
        {rows.slice(0, 5).map((row, index) => (
          <div key={`${row.label}-${index}`}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-zinc-300">{row.label}</span>
              <span className="shrink-0 font-medium text-white">{numberFormatter.format(row.conversions)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-emerald-400/80" style={{ width: `${Math.max((row.conversions / maximum) * 100, row.conversions > 0 ? 5 : 0)}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-zinc-600">{percentFormatter.format(row.rate)}% de conversão</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsConversionsAdvanced({ metrics = {}, periodDays = 30 }) {
  const sessions = toNumber(metrics.sessions);
  const users = toNumber(metrics.activeUsers ?? metrics.users);
  const events = toNumber(metrics.eventCount ?? metrics.events);
  const conversions = toNumber(metrics.keyEvents ?? metrics.conversions ?? metrics.conversionCount);
  const rate = conversionRate(conversions, sessions);
  const conversionsPerUser = conversionRate(conversions, users);

  const sourceRows = (metrics.conversionsBySource?.length ? metrics.conversionsBySource : metrics.trafficSources ?? [])
    .map((row) => {
      const rowSessions = toNumber(row.sessions);
      const rowConversions = conversionValue(row);
      return {
        label: row.source ?? row.channel ?? row.name ?? "Origem não identificada",
        sessions: rowSessions,
        conversions: rowConversions,
        rate: toNumber(row.conversionRate) || conversionRate(rowConversions, rowSessions),
      };
    })
    .filter((row) => row.conversions > 0)
    .sort((a, b) => b.conversions - a.conversions);

  const deviceRows = (metrics.conversionsByDevice?.length ? metrics.conversionsByDevice : metrics.devices ?? [])
    .map((row) => {
      const rowSessions = toNumber(row.sessions ?? row.activeUsers ?? row.users);
      const rowConversions = conversionValue(row);
      return {
        label: row.device ?? row.category ?? row.name ?? "Dispositivo não identificado",
        sessions: rowSessions,
        conversions: rowConversions,
        rate: toNumber(row.conversionRate) || conversionRate(rowConversions, rowSessions),
      };
    })
    .filter((row) => row.conversions > 0)
    .sort((a, b) => b.conversions - a.conversions);

  const eventRows = (metrics.conversionEvents ?? metrics.customEvents ?? metrics.keyEventsBreakdown ?? [])
    .map((row) => ({
      label: row.eventName ?? row.name ?? row.event ?? "Evento",
      conversions: conversionValue(row) || toNumber(row.count ?? row.eventCount),
      value: toNumber(row.value ?? row.revenue),
    }))
    .sort((a, b) => b.conversions - a.conversions);

  const hasConversionData = conversions > 0 || sourceRows.length > 0 || deviceRows.length > 0 || eventRows.length > 0;
  const exportRows = sourceRows.length > 0 ? sourceRows : deviceRows;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Target size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Sprint 12</p>
              <h2 className="text-lg font-semibold text-white">Conversões avançadas</h2>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Acompanhe key events, taxa de conversão e desempenho por origem e dispositivo no período selecionado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">{periodDays} dias</span>
          <button
            type="button"
            onClick={() => downloadCsv(exportRows, "conversoes-analytics.csv")}
            disabled={exportRows.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={15} /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Trophy} label="Conversões" value={numberFormatter.format(conversions)} helper="Key events no período" accent="emerald" />
        <SummaryCard icon={Target} label="Taxa de conversão" value={`${percentFormatter.format(rate)}%`} helper="Conversões por sessão" accent="blue" />
        <SummaryCard icon={Users} label="Conversões por utilizador" value={`${percentFormatter.format(conversionsPerUser)}%`} helper="Relação com a audiência" accent="violet" />
        <SummaryCard icon={MousePointerClick} label="Eventos por conversão" value={conversions > 0 ? percentFormatter.format(events / conversions) : "0"} helper="Interações necessárias" accent="amber" />
      </div>

      {!hasConversionData && (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-medium text-amber-200">Ainda não existem key events disponíveis neste snapshot.</p>
          <p className="mt-1 text-xs leading-5 text-amber-200/60">
            Marque eventos importantes como key events no GA4 e sincronize novamente. O painel já está preparado para receber conversões totais, eventos, origens e dispositivos sem alterar o layout.
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Ranking title="Conversões por origem" description="Canais que geraram mais resultados" rows={sourceRows} emptyMessage="Nenhuma conversão por origem recebida." />
        <Ranking title="Conversões por dispositivo" description="Categorias com melhor desempenho" rows={deviceRows} emptyMessage="Nenhuma conversão por dispositivo recebida." />
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Eventos de conversão</h3>
            <p className="mt-1 text-xs text-zinc-500">Eventos personalizados e key events configurados no GA4.</p>
          </div>
          <Route size={18} className="text-zinc-600" />
        </div>

        <div className="mt-4 divide-y divide-zinc-800">
          {eventRows.length === 0 && <p className="py-6 text-center text-xs text-zinc-500">Nenhum evento de conversão detalhado disponível.</p>}
          {eventRows.slice(0, 8).map((row, index) => (
            <div key={`${row.label}-${index}`} className="flex items-center gap-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-[11px] font-semibold text-zinc-400">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">{row.label}</p>
                <p className="text-[11px] text-zinc-600">{row.value > 0 ? `Valor registado: ${numberFormatter.format(row.value)}` : "Key event"}</p>
              </div>
              <ArrowRight size={14} className="text-zinc-700" />
              <strong className="text-sm text-white">{numberFormatter.format(row.conversions)}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
