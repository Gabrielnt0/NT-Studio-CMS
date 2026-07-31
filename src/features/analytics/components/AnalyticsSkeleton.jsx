function SkeletonBlock({ className = "" }) {
  return <div className={`rounded-2xl border border-zinc-900 bg-zinc-900/60 ${className}`} />;
}

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando dados do Analytics">
      <div className="flex animate-pulse flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-36 rounded bg-zinc-900" />
          <div className="h-9 w-72 max-w-full rounded-lg bg-zinc-900" />
          <div className="h-4 w-[32rem] max-w-full rounded bg-zinc-900/80" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-40 rounded-xl bg-zinc-900" />
          <div className="h-10 w-28 rounded-xl bg-zinc-900" />
        </div>
      </div>

      <SkeletonBlock className="h-24 animate-pulse" />

      <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-36" />
        ))}
      </div>

      <SkeletonBlock className="h-80 animate-pulse" />

      <div className="grid animate-pulse gap-6 xl:grid-cols-2">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>

      <div className="grid animate-pulse gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-72" />
        ))}
      </div>

      <span className="sr-only">Carregando relatório do Google Analytics.</span>
    </div>
  );
}
