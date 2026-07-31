import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AssetPagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-label="Paginação de arquivos"
    >
      <button
        type="button"
        disabled={!canGoPrevious}
        onClick={() => onPageChange?.(page - 1)}
        className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Anterior
      </button>

      <span className="min-w-24 text-center text-sm text-zinc-500">
        Página{" "}
        <strong className="font-medium text-zinc-300">
          {page}
        </strong>{" "}
        de{" "}
        <strong className="font-medium text-zinc-300">
          {totalPages}
        </strong>
      </span>

      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => onPageChange?.(page + 1)}
        className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
