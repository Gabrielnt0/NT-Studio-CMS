import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MediaCardMenu({
  onView,
  onCopy,
  onEdit,
  onDelete,
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

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function MenuButton({
    icon,
    children,
    danger = false,
    onClick,
  }) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          onClick?.();
        }}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition
        ${
          danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        {icon}
        {children}
      </button>
    );
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <MenuButton
            icon={<Eye size={16} />}
            onClick={onView}
          >
            Ver detalhes
          </MenuButton>

          <MenuButton
            icon={<Copy size={16} />}
            onClick={onCopy}
          >
            Copiar URL
          </MenuButton>

          <MenuButton
            icon={<Pencil size={16} />}
            onClick={onEdit}
          >
            Editar Alt Text
          </MenuButton>

          <div className="border-t border-zinc-800" />

          <MenuButton
            danger
            icon={<Trash2 size={16} />}
            onClick={onDelete}
          >
            Excluir imagem
          </MenuButton>

        </div>
      )}
    </div>
  );
}