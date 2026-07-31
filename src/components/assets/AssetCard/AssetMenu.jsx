import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AssetMenu({
  items = [],
  ariaLabel = "Mais opções",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={`separator-${index}`}
                  className="border-t border-zinc-800"
                />
              );
            }

            const Icon = item.icon;

            return (
              <button
                key={item.id || item.label}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick?.();
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
