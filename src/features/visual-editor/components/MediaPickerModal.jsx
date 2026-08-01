import { Image, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function MediaPickerModal({
  isOpen,
  media,
  title = "Selecionar imagem",
  onClose,
  onSelect,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const images = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return (media || [])
      .filter((item) => item?.publicUrl && item?.mimeType?.startsWith("image/"))
      .filter((item) => {
        if (!normalized) return true;
        return [item.name, item.fileName, item.altText]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalized));
      });
  }, [media, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Escolha uma imagem já enviada à Biblioteca de Mídia.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
            aria-label="Fechar"
          >
            <X size={19} />
          </button>
        </header>

        <div className="border-b border-zinc-800 p-4">
          <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <Search size={17} className="text-zinc-600" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Pesquisar imagem..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              autoFocus
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {images.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center text-zinc-500">
              <Image size={34} className="mb-3" />
              <p>Nenhuma imagem encontrada.</p>
              <p className="mt-1 text-xs">Envie imagens pela página Mídia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-left transition hover:border-blue-500"
                >
                  <div className="aspect-square overflow-hidden bg-zinc-900">
                    <img
                      src={item.publicUrl}
                      alt={item.altText || item.name || "Imagem"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="truncate px-3 py-2 text-xs text-zinc-300">
                    {item.name || item.fileName}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
