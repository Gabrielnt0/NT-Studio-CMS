export default function MigrationProgress({ progress }) {
  if (!progress) return null;
  const completed = Math.min(progress.index + (progress.status === "success" ? 1 : 0), progress.total);
  const percentage = Math.round((completed / progress.total) * 100);

  return <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-zinc-300">{progress.status === "running" ? `Migrando ${progress.table}...` : `${progress.table}: ${progress.status}`}</span>
      <span className="font-semibold text-white">{percentage}%</span>
    </div>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} />
    </div>
  </section>;
}
