import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createMedia,
  deleteMedia as deleteMediaRecord,
  listMedia,
  updateMedia,
} from "../services/media.service";
import { deleteMediaFile } from "../services/mediaStorage.service";
import { assertMediaCanBeDeleted } from "../services/mediaUsage.service";

export function useMedia() {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const reloadMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await listMedia();

      setMedia(data);
    } catch (err) {
      console.error("Erro ao carregar mídias:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadMedia();
  }, [reloadMedia]);

  async function createMediaItem(mediaData) {
    setIsMutating(true);

    try {
      const created = await createMedia(mediaData);

      setMedia((current) => [
        created,
        ...current,
      ]);

      return created;
    } finally {
      setIsMutating(false);
    }
  }

  async function updateMediaItem(id, mediaData) {
    setIsMutating(true);

    try {
      const updated = await updateMedia(
        id,
        mediaData,
      );

      setMedia((current) =>
        current.map((item) =>
          item.id === id ? updated : item,
        ),
      );

      return updated;
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteMediaItem(item) {
    if (!item?.id) {
      throw new Error(
        "Não foi possível identificar a mídia.",
      );
    }

    setIsMutating(true);

    try {
      // Impede links quebrados no portfólio, SEO, perfil ou temas.
      await assertMediaCanBeDeleted(item);

      /*
       * O arquivo é removido primeiro para evitar que
       * arquivos órfãos permaneçam no Storage.
       */
      if (item.storagePath) {
        await deleteMediaFile(item.storagePath);
      }

      await deleteMediaRecord(item.id);

      setMedia((current) =>
        current.filter(
          (currentItem) =>
            currentItem.id !== item.id,
        ),
      );

      return item;
    } catch (deleteError) {
      console.error(
        "Erro ao excluir mídia:",
        deleteError,
      );

      throw deleteError;
    } finally {
      setIsMutating(false);
    }
  }

  return {
    media,
    isLoading,
    isMutating,
    error,
    reloadMedia,
    createMedia: createMediaItem,
    updateMedia: updateMediaItem,
    deleteMedia: deleteMediaItem,
  };
}