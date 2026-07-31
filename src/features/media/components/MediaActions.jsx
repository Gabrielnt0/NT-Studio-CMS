import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../../components/ui/Button";

export default function MediaActions({ item }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(item.publicUrl);

      setCopied(true);

      toast.success("URL copiada.");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível copiar a URL.");
    }
  }

  function handleOpenImage() {
    window.open(
      item.publicUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        onClick={handleCopyUrl}
        className="flex-1"
      >
        {copied ? (
          <Check size={18} />
        ) : (
          <Copy size={18} />
        )}

        {copied ? "URL copiada" : "Copiar URL"}
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={handleOpenImage}
        className="flex-1"
      >
        <ExternalLink size={18} />
        Abrir imagem
      </Button>
    </div>
  );
}