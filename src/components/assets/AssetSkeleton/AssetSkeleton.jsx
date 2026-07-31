export default function AssetSkeleton({
  count = 8,
  className = "",
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      aria-label="Carregando arquivos"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
        >
          <div className="aspect-square animate-pulse bg-zinc-800" />

          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />

            <div className="flex justify-between border-t border-zinc-800 pt-4">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
              <div className="h-3 w-12 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
