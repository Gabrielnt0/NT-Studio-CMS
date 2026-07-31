import { AlertTriangle, CheckCircle2, Database } from "lucide-react";

export default function MigrationTable({ inspection, selection, onToggle, onSelectAll }) {
  if (!inspection) return null;
  const entries = Object.values(inspection);
  const allSelected = entries.every((entry) => selection[entry.target]);

  return <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
    <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 px-6 py-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="font-semibold text-white">Conteúdo encontrado</h2>
        <p className="mt-1 text-sm text-zinc-400">Escolha quais tabelas serão copiadas para o novo banco.</p>
      </div>
      <button type="button" onClick={() => onSelectAll(!allSelected)} className="text-sm font-semibold text-blue-400 hover:text-blue-300">
        {allSelected ? "Desmarcar todas" : "Selecionar todas"}
      </button>
    </div>
    <div className="divide-y divide-zinc-800">
      {entries.map((entry) => <label key={entry.target} className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900">
        <div className="flex min-w-0 items-center gap-3">
          <input type="checkbox" checked={Boolean(selection[entry.target])} onChange={() => onToggle(entry.target)} className="h-4 w-4 accent-blue-600" />
          <Database size={18} className="shrink-0 text-zinc-500" />
          <div className="min-w-0">
            <p className="truncate font-medium text-zinc-100">{entry.target}</p>
            <p className="truncate text-xs text-zinc-500">Origem: {entry.source}</p>
            {entry.warning && <p className="mt-1 text-xs text-amber-300">{entry.warning}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {entry.warning ? <AlertTriangle size={17} className="text-amber-400" /> : <CheckCircle2 size={17} className="text-emerald-400" />}
          <span className="min-w-20 text-right text-sm font-semibold text-zinc-200">{entry.rows.length} registro{entry.rows.length === 1 ? "" : "s"}</span>
        </div>
      </label>)}
    </div>
  </section>;
}
