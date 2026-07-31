import { Copy, Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  AssetCard,
  AssetMenu,
} from "../../../components/assets";

function formatFileSize(bytes) {
  if (!bytes) return "Tamanho desconhecido";

  const units = ["B", "KB", "MB", "GB"];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${
    units[unitIndex]
  }`;
}

function formatMediaType(mimeType) {
  if (!mimeType) return "Imagem";

  return mimeType.replace("image/", "").toUpperCase();
}

export default function MediaCard({
  item,
  onClick,
  onDelete,
  onEdit,

  selectable = false,
  selected = false,
  onSelectionChange,
}) {
  if (!item) return null;

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(item.publicUrl);
      toast.success("URL copiada.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível copiar a URL.");
    }
  }

  const menuItems = [
    {
      id: "view",
      label: "Ver detalhes",
      icon: Eye,
      onClick,
    },
    {
      id: "copy",
      label: "Copiar URL",
      icon: Copy,
      onClick: handleCopyUrl,
    },
    {
      id: "edit",
      label: "Editar Alt Text",
      icon: Pencil,
      onClick: () => onEdit?.(item),
    },
    {
      separator: true,
    },
    {
      id: "delete",
      label: "Excluir imagem",
      icon: Trash2,
      danger: true,
      onClick: () => onDelete?.(item),
    },
  ];

  return (
    <AssetCard
      imageUrl={item.publicUrl}
      imageAlt={item.altText || item.name}
      title={item.name}
      subtitle={`${formatMediaType(item.mimeType)} • ${formatFileSize(
        item.size,
      )}`}
      metaLeft={`${item.width} × ${item.height}`}
      actions={
        <AssetMenu
          items={menuItems}
          ariaLabel={`Mais opções para ${item.name}`}
        />
      }
      onClick={onClick}
      selectable={selectable}
      selected={selected}
      onSelectionChange={onSelectionChange}
    />
  );
}