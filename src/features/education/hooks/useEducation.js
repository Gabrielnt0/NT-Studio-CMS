import { useCallback, useEffect, useState } from "react";
import {
  createEducationItem as createRequest,
  deleteEducationItem as deleteRequest,
  getEducationItems,
  updateEducationItem as updateRequest,
} from "../services/education.service";

function sortEducationItems(items) {
  return [...items].sort((first, second) => {
    if (first.isFeatured !== second.isFeatured) {
      return Number(second.isFeatured) - Number(first.isFeatured);
    }

    if (first.displayOrder !== second.displayOrder) {
      return first.displayOrder - second.displayOrder;
    }

    return String(second.startDate).localeCompare(String(first.startDate));
  });
}

export function useEducation() {
  const [educationItems, setEducationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const loadEducation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await getEducationItems();
      setEducationItems(sortEducationItems(items));
    } catch (requestError) {
      console.error("Erro ao carregar formações:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEducation();
  }, [loadEducation]);

  const createEducationItem = useCallback(async (item) => {
    setIsMutating(true);
    setError(null);

    try {
      const created = await createRequest(item);
      setEducationItems((current) =>
        sortEducationItems([created, ...current]),
      );
      return created;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateEducationItem = useCallback(async (itemId, item) => {
    setIsMutating(true);
    setError(null);

    try {
      const updated = await updateRequest(itemId, item);

      setEducationItems((current) =>
        sortEducationItems(
          current.map((entry) =>
            entry.id === itemId ? updated : entry,
          ),
        ),
      );

      return updated;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteEducationItem = useCallback(async (itemId) => {
    setIsMutating(true);
    setError(null);

    try {
      await deleteRequest(itemId);
      setEducationItems((current) =>
        current.filter((entry) => entry.id !== itemId),
      );
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    educationItems,
    isLoading,
    isMutating,
    error,
    reloadEducation: loadEducation,
    createEducationItem,
    updateEducationItem,
    deleteEducationItem,
  };
}
