import { useCallback, useEffect, useState } from "react";
import {
  createExperience as createExperienceRequest,
  deleteExperience as deleteExperienceRequest,
  getExperiences,
  updateExperience as updateExperienceRequest,
} from "../services/experiences.service";

export function useExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const loadExperiences = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (requestError) {
      console.error("Erro ao carregar experiências:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const createExperience = useCallback(async (experience) => {
    setIsMutating(true);
    setError(null);

    try {
      const createdExperience = await createExperienceRequest(experience);
      setExperiences((current) => [createdExperience, ...current]);
      return createdExperience;
    } catch (requestError) {
      console.error("Erro ao criar experiência:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateExperience = useCallback(async (experienceId, experience) => {
    setIsMutating(true);
    setError(null);

    try {
      const updatedExperience = await updateExperienceRequest(
        experienceId,
        experience,
      );

      setExperiences((current) =>
        current.map((item) =>
          item.id === experienceId ? updatedExperience : item,
        ),
      );

      return updatedExperience;
    } catch (requestError) {
      console.error("Erro ao atualizar experiência:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteExperience = useCallback(async (experienceId) => {
    setIsMutating(true);
    setError(null);

    try {
      await deleteExperienceRequest(experienceId);
      setExperiences((current) =>
        current.filter((item) => item.id !== experienceId),
      );
    } catch (requestError) {
      console.error("Erro ao excluir experiência:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    experiences,
    isLoading,
    isMutating,
    error,
    reloadExperiences: loadExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  };
}
