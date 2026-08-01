import { Eye, EyeOff, GripVertical } from "lucide-react";
import { useState } from "react";

export default function SectionsPanel({
  sections,
  selectedSectionId,
  onSelect,
  onToggle,
  onMove,
}) {
  const [draggedId, setDraggedId] = useState(null);

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          draggable
          onDragStart={() => setDraggedId(section.id)}
          onDragEnd={() => setDraggedId(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            onMove(draggedId, section.id);
          }}
          onClick={() => onSelect(section.id)}
          className={[
            "flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left transition",
            selectedSectionId === section.id
              ? "border-blue-500 bg-blue-500/10"
              : "border-zinc-800 bg-zinc-950 hover:border-zinc-700",
            !section.enabled ? "opacity-60" : "",
          ].join(" ")}
        >
          <GripVertical size={16} className="cursor-grab text-zinc-600" />
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-[11px] text-zinc-500">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
            {section.label}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(section.id);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onToggle(section.id);
              }
            }}
            className={[
              "rounded-lg p-1.5",
              section.enabled
                ? "text-blue-400 hover:bg-blue-500/10"
                : "text-zinc-600 hover:bg-zinc-900",
            ].join(" ")}
            title={section.enabled ? "Ocultar seção" : "Exibir seção"}
          >
            {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
          </span>
        </button>
      ))}
    </div>
  );
}
