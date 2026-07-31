export default function Loading({
  message = "Carregando...",
  rows = 5,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
        <span>{message}</span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-lg bg-zinc-800/70"
          />
        ))}
      </div>
    </div>
  );
}
