export default function AssetToolbar({
  title,
  description,
  search,
  filters,
  actions,
  className = "",
}) {
  return (
    <section
      className={`flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="min-w-0">
        {title && (
          <h1 className="text-xl font-semibold text-white">
            {title}
          </h1>
        )}

        {description && (
          <p className="mt-1 text-sm text-zinc-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {search && (
          <div className="w-full sm:w-auto">
            {search}
          </div>
        )}

        {filters && (
          <div className="w-full sm:w-auto">
            {filters}
          </div>
        )}

        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
