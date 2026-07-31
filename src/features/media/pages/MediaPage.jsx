import {
  AlertCircle,
  CheckSquare,
  Copy,
  Search,
  Square,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  AssetBulkActions,
  AssetEmpty,
  AssetGrid,
  AssetSkeleton,
  AssetToolbar,
} from "../../../components/assets";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { supabase } from "../../../services/supabase";
import MediaCard from "../components/MediaCard";
import MediaDetailsModal from "../components/MediaDetailsModal";
import MediaUploadButton from "../components/MediaUploadButton";
import { useMedia } from "../hooks/useMedia";
import {
  deleteMediaFile,
  uploadMedia,
} from "../services/mediaStorage.service";
import { getImageDimensions } from "../utils/getImageDimensions";

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function MediaPage() {
  const {
    media,
    isLoading,
    isMutating,
    error,
    reloadMedia,
    createMedia,
    deleteMedia,
  } = useMedia();

  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSelectionMode, setIsSelectionMode] =
    useState(false);
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(),
  );

  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const filteredMedia = media
    .filter(Boolean)
    .filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(normalizedSearch),
    );

  const selectedItems = media.filter(
    (item) => item?.id && selectedIds.has(item.id),
  );

  const selectedCount = selectedItems.length;

  const selectableFilteredItems = filteredMedia.filter(
    (item) => item?.id,
  );

  const areAllFilteredSelected =
    selectableFilteredItems.length > 0 &&
    selectableFilteredItems.every((item) =>
      selectedIds.has(item.id),
    );

  function handleOpenMedia(item) {
    if (!item || isSelectionMode) {
      return;
    }

    setSelectedMedia(item);
  }

  function handleCloseMedia() {
    setSelectedMedia(null);
  }

  function handleEnableSelectionMode() {
    setIsSelectionMode(true);
    setSelectedMedia(null);
  }

  function handleClearSelection() {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  }

  function removeItemsFromSelection(itemIds) {
    setSelectedIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(
        currentSelectedIds,
      );

      itemIds.forEach((itemId) => {
        nextSelectedIds.delete(itemId);
      });

      return nextSelectedIds;
    });
  }

  function handleToggleSelection(itemId) {
    if (!itemId) {
      return;
    }

    setSelectedIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(
        currentSelectedIds,
      );

      if (nextSelectedIds.has(itemId)) {
        nextSelectedIds.delete(itemId);
      } else {
        nextSelectedIds.add(itemId);
      }

      return nextSelectedIds;
    });
  }

  function handleToggleSelectAll() {
    if (selectableFilteredItems.length === 0) {
      return;
    }

    setSelectedIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(
        currentSelectedIds,
      );

      if (areAllFilteredSelected) {
        selectableFilteredItems.forEach((item) => {
          nextSelectedIds.delete(item.id);
        });
      } else {
        selectableFilteredItems.forEach((item) => {
          nextSelectedIds.add(item.id);
        });
      }

      return nextSelectedIds;
    });

    setIsSelectionMode(true);
  }

  async function handleCopySelectedUrls() {
    const urls = selectedItems
      .map((item) => item.publicUrl)
      .filter(Boolean);

    if (urls.length === 0) {
      toast.error(
        "Nenhuma URL disponível para copiar.",
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        urls.join("\n"),
      );

      toast.success(
        urls.length === 1
          ? "URL copiada."
          : `${urls.length} URLs copiadas.`,
      );
    } catch (copyError) {
      console.error(
        "Erro ao copiar URLs:",
        copyError,
      );

      toast.error(
        "Não foi possível copiar as URLs.",
      );
    }
  }

  async function handleDeleteMedia(item) {
    if (!item?.id || isMutating) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir "${item.name}"? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMedia(item);

      removeItemsFromSelection([item.id]);

      if (selectedMedia?.id === item.id) {
        setSelectedMedia(null);
      }

      toast.success("Imagem excluída com sucesso.");
    } catch (deleteError) {
      console.error(
        "Erro ao excluir imagem:",
        deleteError,
      );

      toast.error(
        deleteError?.message ||
          "Não foi possível excluir a imagem.",
      );
    }
  }

  async function handleDeleteSelected() {
    if (selectedItems.length === 0 || isMutating) {
      return;
    }

    const totalItems = selectedItems.length;

    const confirmed = window.confirm(
      totalItems === 1
        ? `Deseja realmente excluir "${selectedItems[0].name}"? Esta ação não poderá ser desfeita.`
        : `Deseja realmente excluir ${totalItems} imagens? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    const deletedIds = [];
    const failedItems = [];

    for (const item of selectedItems) {
      try {
        await deleteMedia(item);
        deletedIds.push(item.id);
      } catch (deleteError) {
        console.error(
          `Erro ao excluir ${item.name}:`,
          deleteError,
        );

        failedItems.push(item);
      }
    }

    if (deletedIds.length > 0) {
      removeItemsFromSelection(deletedIds);
    }

    if (failedItems.length === 0) {
      handleClearSelection();

      toast.success(
        totalItems === 1
          ? "Imagem excluída com sucesso."
          : `${totalItems} imagens excluídas com sucesso.`,
      );

      return;
    }

    if (deletedIds.length > 0) {
      toast.success(
        `${deletedIds.length} arquivo${
          deletedIds.length > 1 ? "s" : ""
        } excluído${
          deletedIds.length > 1 ? "s" : ""
        }.`,
      );
    }

    toast.error(
      failedItems.length === 1
        ? `Não foi possível excluir "${failedItems[0].name}".`
        : `Não foi possível excluir ${failedItems.length} arquivos.`,
    );
  }

  async function handleSelectFiles(files) {
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);

    let successfulUploads = 0;
    let failedUploads = 0;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Usuário não autenticado.",
        );
      }

      for (const file of files) {
        if (
          !ALLOWED_IMAGE_TYPES.includes(file.type)
        ) {
          failedUploads += 1;

          toast.error(
            `${file.name}: formato não permitido.`,
          );

          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          failedUploads += 1;

          toast.error(
            `${file.name}: tamanho máximo de 10 MB.`,
          );

          continue;
        }

        let uploadedFile = null;

        try {
          const dimensions =
            await getImageDimensions(file);

          uploadedFile = await uploadMedia(
            file,
            user.id,
          );

          await createMedia({
            name: file.name.replace(
              /\.[^/.]+$/,
              "",
            ),
            fileName: file.name,
            publicUrl: uploadedFile.publicUrl,
            storagePath:
              uploadedFile.storagePath,
            mimeType: file.type,
            size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            altText: "",
          });

          successfulUploads += 1;
        } catch (uploadError) {
          failedUploads += 1;

          console.error(
            `Erro ao enviar ${file.name}:`,
            uploadError,
          );

          if (uploadedFile?.storagePath) {
            try {
              await deleteMediaFile(
                uploadedFile.storagePath,
              );
            } catch (cleanupError) {
              console.error(
                "Erro ao remover arquivo após falha:",
                cleanupError,
              );
            }
          }

          toast.error(
            `${file.name}: ${
              uploadError?.message ||
              "não foi possível realizar o upload"
            }`,
          );
        }
      }

      if (
        successfulUploads > 0 &&
        failedUploads === 0
      ) {
        toast.success(
          successfulUploads === 1
            ? "Imagem enviada com sucesso."
            : `${successfulUploads} imagens enviadas com sucesso.`,
        );
      } else if (successfulUploads > 0) {
        toast.success(
          `${successfulUploads} arquivo${
            successfulUploads > 1 ? "s" : ""
          } enviado${
            successfulUploads > 1 ? "s" : ""
          }.`,
        );
      }
    } catch (requestError) {
      console.error(
        "Erro geral no upload:",
        requestError,
      );

      toast.error(
        requestError?.message ||
          "Não foi possível realizar o upload.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  const searchInput = (
    <div className="relative w-full sm:w-80">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <Input
        type="search"
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        placeholder="Pesquisar imagens..."
        className="pl-11"
      />
    </div>
  );

  const toolbarActions = (
    <div className="flex flex-wrap items-center gap-2">
      {media.length > 0 &&
        (isSelectionMode ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearSelection}
            disabled={isMutating}
          >
            <X size={17} />
            Cancelar seleção
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={handleEnableSelectionMode}
            disabled={isMutating}
          >
            <CheckSquare size={17} />
            Selecionar
          </Button>
        ))}

      <MediaUploadButton
        onSelect={handleSelectFiles}
        disabled={isUploading || isMutating}
      />
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-400">
            Biblioteca de mídia
          </p>
        </div>

        <AssetToolbar
          title="Mídia"
          description="Gerencie todas as imagens utilizadas no seu portfólio."
          search={searchInput}
          actions={toolbarActions}
        />

        {isSelectionMode &&
          filteredMedia.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Modo de seleção
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Clique nos cards para selecionar
                  várias imagens.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleToggleSelectAll}
                disabled={isMutating}
              >
                {areAllFilteredSelected ? (
                  <CheckSquare size={17} />
                ) : (
                  <Square size={17} />
                )}

                {areAllFilteredSelected
                  ? "Desmarcar exibidas"
                  : "Selecionar exibidas"}
              </Button>
            </div>
          )}

        <AssetBulkActions
          selectedCount={selectedCount}
          onClear={handleClearSelection}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopySelectedUrls}
            disabled={isMutating}
          >
            <Copy size={17} />

            {selectedCount === 1
              ? "Copiar URL"
              : "Copiar URLs"}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDeleteSelected}
            disabled={isMutating}
          >
            <Trash2 size={17} />

            {isMutating
              ? "Excluindo..."
              : selectedCount === 1
                ? "Excluir"
                : "Excluir selecionadas"}
          </Button>
        </AssetBulkActions>

        {isLoading ? (
          <AssetSkeleton count={8} />
        ) : error ? (
          <AssetEmpty
            icon={AlertCircle}
            title="Não foi possível carregar a biblioteca"
            description="Verifique a conexão e tente novamente."
            action={
              <Button
                type="button"
                variant="secondary"
                onClick={reloadMedia}
              >
                Tentar novamente
              </Button>
            }
          />
        ) : filteredMedia.length > 0 ? (
          <AssetGrid>
            {filteredMedia.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={() =>
                  handleOpenMedia(item)
                }
                onDelete={() =>
                  handleDeleteMedia(item)
                }
                selectable={isSelectionMode}
                selected={selectedIds.has(item.id)}
                onSelectionChange={() =>
                  handleToggleSelection(item.id)
                }
              />
            ))}
          </AssetGrid>
        ) : (
          <AssetEmpty
            icon={Upload}
            title={
              media.length === 0
                ? "Biblioteca vazia"
                : "Nenhuma imagem encontrada"
            }
            description={
              media.length === 0
                ? "Faça upload da sua primeira imagem."
                : "Tente pesquisar por outro nome."
            }
            action={
              media.length === 0 ? (
                <MediaUploadButton
                  onSelect={handleSelectFiles}
                  disabled={
                    isUploading || isMutating
                  }
                />
              ) : undefined
            }
          />
        )}
      </div>

      <MediaDetailsModal
        item={selectedMedia}
        isOpen={Boolean(selectedMedia)}
        onClose={handleCloseMedia}
      />
    </>
  );
}