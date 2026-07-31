import { X } from "lucide-react";

import MediaActions from "./MediaActions";
import MediaInfo from "./MediaInfo";
import MediaPreview from "./MediaPreview";

export default function MediaDetailsModal({
  item,
  isOpen,
  onClose,
}) {
  if (!isOpen || !item) {
    return null;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <section className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">

        <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-400">
              Biblioteca de mídia
            </p>

            <h2 className="truncate text-xl font-semibold text-white">
              {item.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto">

          <MediaPreview item={item} />

          <div className="space-y-8 border-t border-zinc-800 p-6">

            <MediaInfo item={item} />

            <MediaActions item={item} />

          </div>

        </div>

      </section>
    </div>
  );
}