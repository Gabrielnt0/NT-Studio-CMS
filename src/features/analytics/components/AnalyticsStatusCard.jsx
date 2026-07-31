import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2";
import Clock3 from "lucide-react/dist/esm/icons/clock-3";

const states = {
  connected: { icon: CheckCircle2, className: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400", label: "Conectado" },
  error: { icon: AlertCircle, className: "border-red-500/20 bg-red-500/5 text-red-400", label: "Erro" },
  pending: { icon: Clock3, className: "border-amber-500/20 bg-amber-500/5 text-amber-400", label: "Pendente" },
};

export default function AnalyticsStatusCard({ title, description, status = "pending", detail }) {
  const current = states[status] ?? states.pending;
  const Icon = current.icon;

  return (
    <article className={`rounded-2xl border p-5 ${current.className}`}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-current/10">
          <Icon size={21} />
        </span>
        <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">{current.label}</span>
      </div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
      {detail && <p className="mt-3 text-xs text-zinc-500">{detail}</p>}
    </article>
  );
}
