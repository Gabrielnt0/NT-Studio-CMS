import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  Eye,
  Globe2,
  MonitorSmartphone,
  Radio,
  RefreshCw,
  Users,
} from "lucide-react";

const REFRESH_INTERVAL_SECONDS = 60;

function number(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value ?? 0));
}

function formatRelativeTime(value) {
  if (!value) return "Ainda não sincronizado";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Data indisponível";

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (elapsedSeconds < 60) return "há menos de 1 minuto";
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `há ${elapsedMinutes} min`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `há ${elapsedHours} h`;
  return `há ${Math.floor(elapsedHours / 24)} d`;
}

function getRowLabel(row, keys) {
  for (const key of keys) {
    if (row?.[key]) return row[key];
  }
  return "Não identificado";
}

function getRowValue(row, keys) {
  for (const key of keys) {
    const value = Number(row?.[key]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon size={18} />
        </span>
        <Radio size={16} className="text-emerald-400" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-300">{label}</p>
      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </article>
  );
}

function RankingList({ title, description, rows, labelKeys, valueKeys, emptyMessage }) {
  const maxValue = Math.max(...rows.map((row) => getRowValue(row, valueKeys)), 1);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-800 px-4 py-8 text-center text-sm text-zinc-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {rows.slice(0, 5).map((row, index) => {
            const value = getRowValue(row, valueKeys);
            const width = Math.max(5, (value / maxValue) * 100);
            return (
              <div key={`${getRowLabel(row, labelKeys)}-${index}`}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate text-zinc-300">{getRowLabel(row, labelKeys)}</span>
                  <span className="shrink-0 font-medium text-white">{number(value)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default function AnalyticsRealtimeEnterprise({
  metrics = {},
  connected = false,
  lastSyncedAt,
  onRefresh,
  isRefreshing = false,
}) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(REFRESH_INTERVAL_SECONDS);

  const latestDay = useMemo(() => {
    const rows = Array.isArray(metrics.daily) ? metrics.daily : [];
    return rows.at(-1) ?? {};
  }, [metrics.daily]);

  useEffect(() => {
    if (!autoRefresh || !connected || typeof onRefresh !== "function") return undefined;

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          Promise.resolve(onRefresh()).catch(() => undefined);
          return REFRESH_INTERVAL_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [autoRefresh, connected, onRefresh]);

  const latestUsers = getRowValue(latestDay, ["activeUsers", "users"]);
  const latestViews = getRowValue(latestDay, ["screenPageViews", "views"]);
  const latestEvents = getRowValue(latestDay, ["eventCount", "events"]);

  const topPages = Array.isArray(metrics.topPages) ? metrics.topPages : [];
  const sources = Array.isArray(metrics.trafficSources) ? metrics.trafficSources : [];
  const countries = Array.isArray(metrics.countries) ? metrics.countries : [];
  const devices = Array.isArray(metrics.devices) ? metrics.devices : [];

  const leadingDevice = devices[0];
  const leadingCountry = countries[0];

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950">
      <header className="flex flex-col gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Radio size={20} />
            {connected && <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-white">Realtime Enterprise</h2>
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${connected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>
                {connected ? "Monitoramento ativo" : "Aguardando conexão"}
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500">
              Snapshot operacional com atualização automática dos dados mais recentes disponíveis no Analytics.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRefresh((current) => !current)}
            disabled={!connected}
            className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${autoRefresh && connected ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-zinc-800 bg-zinc-900 text-zinc-400"} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Autoatualização {autoRefresh ? "ativada" : "pausada"}
          </button>
          <button
            type="button"
            onClick={() => onRefresh?.()}
            disabled={!connected || isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            Atualizar agora
          </button>
        </div>
      </header>

      <div className="space-y-6 p-5">
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2"><Clock3 size={14} /> Última sincronização: {formatRelativeTime(lastSyncedAt)}</span>
          <span>{autoRefresh && connected ? `Próxima verificação em ${secondsRemaining}s` : "Atualização automática pausada"}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Users} label="Usuários recentes" value={number(latestUsers)} helper="último ponto diário disponível" />
          <Metric icon={Eye} label="Visualizações recentes" value={number(latestViews)} helper="último ponto diário disponível" />
          <Metric icon={Activity} label="Eventos recentes" value={number(latestEvents)} helper="último ponto diário disponível" />
          <Metric icon={MonitorSmartphone} label="Dispositivo líder" value={getRowLabel(leadingDevice, ["device", "name"])} helper={`${number(getRowValue(leadingDevice, ["sessions", "activeUsers", "users"]))} interações registradas`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <RankingList
            title="Páginas em destaque"
            description="Conteúdo com maior atividade no snapshot atual"
            rows={topPages}
            labelKeys={["title", "page", "path"]}
            valueKeys={["views", "screenPageViews", "activeUsers"]}
            emptyMessage="Nenhuma página disponível no snapshot."
          />
          <RankingList
            title="Origens ativas"
            description="Canais com maior volume de sessões"
            rows={sources}
            labelKeys={["source", "channel", "name"]}
            valueKeys={["sessions", "activeUsers", "users"]}
            emptyMessage="Nenhuma origem disponível no snapshot."
          />
          <RankingList
            title="Países ativos"
            description="Distribuição geográfica mais recente"
            rows={countries}
            labelKeys={["country", "name"]}
            valueKeys={["activeUsers", "users", "sessions"]}
            emptyMessage="Nenhum país disponível no snapshot."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400"><Globe2 size={18} /></span>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">Principal localização</p>
              <p className="truncate font-medium text-white">{getRowLabel(leadingCountry, ["country", "name"])}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400"><MonitorSmartphone size={18} /></span>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">Principal dispositivo</p>
              <p className="truncate font-medium text-white">{getRowLabel(leadingDevice, ["device", "name"])}</p>
            </div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-zinc-600">
          Este painel não inventa visitantes online: ele atualiza o snapshot mais recente armazenado pelo projeto. Dados realmente intraminuto exigem o endpoint Realtime da Google Analytics Data API na Edge Function.
        </p>
      </div>
    </section>
  );
}
