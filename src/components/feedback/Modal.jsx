import { X } from "lucide-react";
import { useEffect } from "react";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "lg",
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizes = {
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className={[
          "flex max-h-full w-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl",
          sizes[size] ?? sizes.lg,
        ].join(" ")}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;