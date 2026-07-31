import { ImageOff } from "lucide-react";

export default function AssetEmpty({
  icon: Icon = ImageOff,
  title = "Nenhum arquivo encontrado",
  description = "Adicione um novo arquivo ou altere os filtros da busca.",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-12 text-center ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-500">
        <Icon size={26} />
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
