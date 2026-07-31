import { useCallback, useEffect, useState } from "react";
import {
  createSkillItem as createRequest,
  deleteSkillItem as deleteRequest,
  getSkillItems,
  updateSkillItem as updateRequest,
} from "../services/skills.service";

function sortSkillItems(items) {
  return [...items].sort((first, second) => {
    if (first.isFeatured !== second.isFeatured) {
      return Number(second.isFeatured) - Number(first.isFeatured);
    }
    if (first.displayOrder !== second.displayOrder) {
      return first.displayOrder - second.displayOrder;
    }
    return first.name.localeCompare(second.name, "pt-BR");
  });
}

export function useSkills() {
  const [skillItems, setSkillItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getSkillItems();
      setSkillItems(sortSkillItems(items));
    } catch (requestError) {
      console.error("Erro ao carregar habilidades:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadSkills(); }, [loadSkills]);

  const createSkillItem = useCallback(async (item) => {
    setIsMutating(true);
    setError(null);
    try {
      const created = await createRequest(item);
      setSkillItems((current) => sortSkillItems([created, ...current]));
      return created;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateSkillItem = useCallback(async (itemId, item) => {
    setIsMutating(true);
    setError(null);
    try {
      const updated = await updateRequest(itemId, item);
      setSkillItems((current) =>
        sortSkillItems(current.map((entry) => entry.id === itemId ? updated : entry))
      );
      return updated;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteSkillItem = useCallback(async (itemId) => {
    setIsMutating(true);
    setError(null);
    try {
      await deleteRequest(itemId);
      setSkillItems((current) => current.filter((entry) => entry.id !== itemId));
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    skillItems,
    isLoading,
    isMutating,
    error,
    reloadSkills: loadSkills,
    createSkillItem,
    updateSkillItem,
    deleteSkillItem,
  };
}
