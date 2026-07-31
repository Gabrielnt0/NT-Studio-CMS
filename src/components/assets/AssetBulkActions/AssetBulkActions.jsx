import { X } from "lucide-react";

export default function AssetBulkActions({
  selectedCount = 0,
  onClear,
  children,
  className = "",
}) {
  if (selectedCount <= 0) {
    return null;
  }

  return (
    <section
      aria-label="Ações dos arquivos selecionados"
      className={`flex flex-col gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-blue-500 px-3 text-sm font-bold text-white">
          {selectedCount}
        </div>

        <div>
          <p className="font-semibold text-white">
            {selectedCount === 1
              ? "1 arquivo selecionado"
              : `${selectedCount} arquivos selecionados`}
          </p>

          <p className="text-sm text-zinc-400">
            Escolha uma ação para os itens selecionados.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {children}

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X size={17} />

          Limpar seleção
        </button>
      </div>
    </section>
  );
}