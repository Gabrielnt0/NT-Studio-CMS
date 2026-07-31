import { CheckCircle2, XCircle } from "lucide-react";

export default function MigrationResult({ result }) {
  if (!result.length) return null;
  const succeeded = result.filter((item) => item.status === "success").length;
  const failed = result.length - succeeded;

  return <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <h2 className="font-semibold text-white">Resultado</h2>
      <p className="text-sm text-zinc-400">{succeeded} concluída(s){failed ? ` · ${failed} com erro` : ""}</p>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {result.map((item) => <div key={item.table} className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {item.status === "success" ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
            <span className="text-sm text-zinc-200">{item.table}</span>
          </div>
          <span className="text-sm font-semibold text-white">{item.count}</span>
        </div>
        {item.error && <p className="mt-2 text-xs text-red-300">{item.error}</p>}
      </div>)}
    </div>
  </section>;
}
