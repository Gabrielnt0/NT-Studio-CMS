import { Activity, Clock3, Eye, RefreshCw, Users } from "lucide-react";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(toNumber(value));
}

function formatRelativeDate(value) {
  if (!value) return "Ainda não sincronizado";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Data indisponível";
  const elapsed = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "Sincronizado agora";
  if (minutes < 60) return `Sincronizado há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Sincronizado há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Sincronizado há ${days} dia${days === 1 ? "" : "s"}`;
}

function pickLabel(row, keys, fallback) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return fallback;
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
      <div className="flex items-center gap-2 text-xs text-zinc-500"><Icon size={14} />{label}</div>
      <p className="mt-2 truncate text-sm font-semibold text-white" title={String(value)}>{value}</p>
    </div>
  );
}

export default function AnalyticsRealtimeCard({ metrics = {}, connected = false, lastSyncedAt }) {
  const daily = Array.isArray(metrics.daily) ? metrics.daily : [];
  const latest = daily[daily.length - 1] ?? {};
  const topPage = Array.isArray(metrics.topPages) ? metrics.topPages[0] : null;
  const topSource = Array.isArray(metrics.trafficSources) ? metrics.trafficSources[0] : null;
  const topDevice = Array.isArray(metrics.devices) ? metrics.devices[0] : null;

  const latestUsers = toNumber(latest.activeUsers ?? latest.users);
  const latestViews = toNumber(latest.screenPageViews ?? latest.views);
  const pageLabel = pickLabel(topPage, ["title", "page", "path"], "Sem dados");
  const sourceLabel = pickLabel(topSource, ["source", "channel", "name"], "Sem dados");
  const deviceLabel = pickLabel(topDevice, ["device", "category", "name"], "Sem dados");

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-400" : "bg-zinc-600"}`} />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Atividade recente</p>
          </div>
          <h2 className="mt-1 text-lg font-semibold text-white">Último retrato disponível</h2>
          <p className="mt-1 text-sm text-zinc-500">Resumo baseado na sincronização mais recente do Google Analytics.</p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">
          <RefreshCw size={13} />{formatRelativeDate(lastSyncedAt)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat icon={Users} label="Usuários no último dia" value={formatNumber(latestUsers)} />
        <Stat icon={Eye} label="Visualizações no último dia" value={formatNumber(latestViews)} />
        <Stat icon={Activity} label="Principal origem" value={sourceLabel} />
        <Stat icon={Clock3} label="Dispositivo dominante" value={deviceLabel} />
        <Stat icon={Eye} label="Página em destaque" value={pageLabel} />
      </div>

      <p className="mt-4 text-xs text-zinc-600">
        Este painel não representa utilizadores online em tempo real; ele mostra o dado mais recente já recebido pela integração atual.
      </p>
    </section>
  );
}
