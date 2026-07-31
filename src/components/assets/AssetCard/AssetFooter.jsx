export default function AssetFooter({
  title,
  subtitle,
  metaLeft,
  metaRight,
  actions,
}) {
  return (
    <div className="rounded-b-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-medium text-white">
            {title || "Arquivo sem nome"}
          </h2>

          {subtitle && (
            <p className="mt-1 truncate text-xs text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>

      {(metaLeft || metaRight) && (
        <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          <span>{metaLeft}</span>
          <span>{metaRight}</span>
        </div>
      )}
    </div>
  );
}
