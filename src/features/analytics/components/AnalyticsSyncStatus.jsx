import { CheckCircle2, Clock3 } from "lucide-react";

function relativeTime(value) {
  if (!value) return "Nunca sincronizado";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Sincronizado agora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Sincronizado há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Sincronizado há ${hours} h`;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export default function AnalyticsSyncStatus({ lastSyncedAt, connected }) {
  const Icon = connected ? CheckCircle2 : Clock3;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${connected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>
      <Icon size={14} />
      {relativeTime(lastSyncedAt)}
    </span>
  );
}
