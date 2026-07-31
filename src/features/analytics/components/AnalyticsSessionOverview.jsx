import { Activity, Clock3, Eye, MousePointerClick, Users } from "lucide-react";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits }).format(toNumber(value));
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function formatDuration(seconds, fallback) {
  if (fallback) return fallback;
  const safeSeconds = Math.max(0, Math.round(toNumber(seconds)));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

function Metric({ icon: Icon, label, value, helper, tone = "blue" }) {
  const tones = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  };

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
          <strong className="mt-2 block truncate text-2xl font-semibold text-white">{value}</strong>
          <p className="mt-1 text-xs text-zinc-500">{helper}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tones[tone] ?? tones.blue}`}>
          <Icon size={19} />
        </span>
      </div>
    </article>
  );
}

export default function AnalyticsSessionOverview({ metrics = {} }) {
  const users = toNumber(metrics.activeUsers);
  const sessions = toNumber(metrics.sessions);
  const views = toNumber(metrics.screenPageViews);
  const events = toNumber(metrics.eventCount);
  const averageDuration = toNumber(metrics.averageSessionDuration);

  const sessionsPerUser = users > 0 ? sessions / users : 0;
  const viewsPerSession = sessions > 0 ? views / sessions : 0;
  const eventsPerSession = sessions > 0 ? events / sessions : 0;

  const engagementRateFromApi = toNumber(metrics.engagementRate);
  const bounceRateFromApi = toNumber(metrics.bounceRate);
  const estimatedEngagement = Math.min(100, Math.max(0, (viewsPerSession / 2) * 45 + (eventsPerSession / 4) * 35 + Math.min(averageDuration / 180, 1) * 20));
  const engagementRate = engagementRateFromApi > 0 ? engagementRateFromApi * (engagementRateFromApi <= 1 ? 100 : 1) : estimatedEngagement;
  const bounceRate = bounceRateFromApi > 0 ? bounceRateFromApi * (bounceRateFromApi <= 1 ? 100 : 1) : Math.max(0, 100 - engagementRate);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Visão de sessões</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Qualidade da audiência</h2>
          <p className="mt-1 text-sm text-zinc-500">Indicadores calculados com os dados disponíveis no período selecionado.</p>
        </div>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">
          {formatNumber(sessions)} sessões
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric icon={Users} label="Sessões por usuário" value={formatNumber(sessionsPerUser, 2)} helper="Frequência média de retorno" tone="blue" />
        <Metric icon={Eye} label="Páginas por sessão" value={formatNumber(viewsPerSession, 2)} helper="Profundidade de navegação" tone="violet" />
        <Metric icon={MousePointerClick} label="Eventos por sessão" value={formatNumber(eventsPerSession, 2)} helper="Interações médias" tone="amber" />
        <Metric icon={Clock3} label="Duração média" value={formatDuration(averageDuration, metrics.averageSessionDurationFormatted)} helper="Tempo médio por sessão" tone="cyan" />
        <Metric icon={Activity} label="Engajamento" value={formatPercent(engagementRate)} helper={`Rejeição estimada: ${formatPercent(bounceRate)}`} tone="emerald" />
      </div>

      {!engagementRateFromApi && !bounceRateFromApi && (
        <p className="mt-4 text-xs text-zinc-600">
          Engajamento e rejeição são estimativas locais enquanto essas métricas não forem retornadas diretamente pelo Google Analytics.
        </p>
      )}
    </section>
  );
}
