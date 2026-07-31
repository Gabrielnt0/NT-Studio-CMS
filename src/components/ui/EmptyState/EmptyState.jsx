export default function EmptyState({
  title = "Nenhum item encontrado",
  description = "Ainda não há dados para exibir.",
  action = null,
  icon = null,
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-zinc-400">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}
