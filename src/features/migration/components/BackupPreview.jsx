import { FileCheck2, RotateCcw, X } from "lucide-react";

export default function BackupPreview({ pendingBackup, loading, onRestore, onCancel }) {
  if (!pendingBackup) return null;
  const entries = Object.entries(pendingBackup.backup.data);
  const rows = entries.reduce((total, [, value]) => total + (Array.isArray(value) ? value.length : 0), 0);

  return <section className="rounded-2xl border border-violet-900/60 bg-violet-950/20 p-6">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
      <div className="flex gap-3">
        <div className="rounded-xl bg-violet-500/10 p-3 text-violet-300"><FileCheck2 size={20} /></div>
        <div>
          <h2 className="font-semibold text-white">Backup validado</h2>
          <p className="mt-1 text-sm text-zinc-400">{pendingBackup.fileName}</p>
          <p className="mt-2 text-sm text-zinc-300">{rows} registros em {entries.filter(([, value]) => Array.isArray(value) && value.length > 0).length} tabelas.</p>
        </div>
      </div>
      <button type="button" onClick={onCancel} className="text-zinc-500 hover:text-white" aria-label="Cancelar restauração"><X size={20} /></button>
    </div>
    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([table, value]) => <div key={table} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm">
        <span className="truncate text-zinc-300">{table}</span><span className="font-semibold text-white">{Array.isArray(value) ? value.length : 0}</span>
      </div>)}
    </div>
    <button type="button" disabled={loading} onClick={onRestore} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">
      <RotateCcw size={17} /> {loading ? "Restaurando..." : "Restaurar este backup"}
    </button>
  </section>;
}
