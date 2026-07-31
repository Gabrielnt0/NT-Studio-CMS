import { Activity, MonitorSmartphone, Route, Users } from "lucide-react";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(toNumber(value));
}

function labelOf(row, keys, fallback) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return fallback;
}

function SourceRow({ row, index, maxSessions }) {
  const sessions = toNumber(row?.sessions);
  const users = toNumber(row?.activeUsers ?? row?.users);
  const width = Math.max(4, (sessions / maxSessions) * 100);
  const label = labelOf(row, ["source", "channel", "name"], `Origem ${index + 1}`);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-xs text-zinc-500">{formatNumber(users)} utilizadores</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-zinc-200">{formatNumber(sessions)} sessões</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsAcquisitionOverview({ sources = [], devices = [] }) {
  const topSources = Array.isArray(sources) ? sources.slice(0, 4) : [];
  const topDevice = Array.isArray(devices) ? devices[0] : null;
  const totalSessions = topSources.reduce((sum, row) => sum + toNumber(row?.sessions), 0);
  const totalUsers = topSources.reduce((sum, row) => sum + toNumber(row?.activeUsers ?? row?.users), 0);
  const maxSessions = Math.max(...topSources.map((row) => toNumber(row?.sessions)), 1);
  const leadingSource = labelOf(topSources[0], ["source", "channel", "name"], "Sem dados");
  const leadingDevice = labelOf(topDevice, ["device", "category", "name"], "Sem dados");

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Aquisição</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Como a audiência chega ao projeto</h2>
        <p className="mt-1 text-sm text-zinc-500">Leitura rápida das principais origens e do dispositivo dominante.</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500"><Activity size={14} /> Sessões das principais origens</div>
          <p className="mt-2 text-xl font-semibold text-white">{formatNumber(totalSessions)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500"><Users size={14} /> Utilizadores alcançados</div>
          <p className="mt-2 text-xl font-semibold text-white">{formatNumber(totalUsers)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500"><Route size={14} /> Principal origem</div>
          <p className="mt-2 truncate text-sm font-semibold text-white" title={leadingSource}>{leadingSource}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500"><MonitorSmartphone size={14} /> Dispositivo dominante</div>
          <p className="mt-2 truncate text-sm font-semibold text-white" title={leadingDevice}>{leadingDevice}</p>
        </div>
      </div>

      {topSources.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">Nenhuma origem de tráfego registrada.</div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {topSources.map((row, index) => <SourceRow key={`${labelOf(row, ["source", "channel", "name"], "source")}-${index}`} row={row} index={index} maxSessions={maxSessions} />)}
        </div>
      )}
    </section>
  );
}
