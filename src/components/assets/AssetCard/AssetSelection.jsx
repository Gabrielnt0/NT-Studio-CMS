import { Check } from "lucide-react";

export default function AssetSelection({
  selected = false,
  onClick,
}) {
  if (!selected && !onClick) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg transition ${
        selected
          ? "border-blue-500 bg-blue-600 text-white"
          : "border-zinc-600 bg-zinc-950/80 text-transparent opacity-0 backdrop-blur group-hover:opacity-100"
      }`}
      aria-label={selected ? "Remover seleção" : "Selecionar arquivo"}
    >
      <Check size={17} />
    </button>
  );
}
