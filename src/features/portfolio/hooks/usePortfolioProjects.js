import { useCallback, useEffect, useState } from "react";
import {
  createProject as createProjectRequest,
  deleteProject as deleteProjectRequest,
  getProjects,
  toggleProjectFeatured as toggleProjectFeaturedRequest,
  updateProject as updateProjectRequest,
} from "../services/portfolioProjects.service";

export function usePortfolioProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProjects();
      setProjects(data);
    } catch (requestError) {
      console.error("Erro ao carregar projetos:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjects]);

  const createProject = useCallback(async (project) => {
    setIsMutating(true);
    setError(null);

    try {
      const createdProject = await createProjectRequest(project);

      setProjects((currentProjects) => [
        createdProject,
        ...currentProjects,
      ]);

      return createdProject;
    } catch (requestError) {
      console.error("Erro ao criar projeto:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateProject = useCallback(async (projectId, project) => {
    setIsMutating(true);
    setError(null);

    try {
      const updatedProject = await updateProjectRequest(projectId, project);

      setProjects((currentProjects) =>
        currentProjects.map((currentProject) =>
          currentProject.id === projectId ? updatedProject : currentProject,
        ),
      );

      return updatedProject;
    } catch (requestError) {
      console.error("Erro ao atualizar projeto:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    setIsMutating(true);
    setError(null);

    try {
      await deleteProjectRequest(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId),
      );
    } catch (requestError) {
      console.error("Erro ao excluir projeto:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (projectId, featured) => {
    setIsMutating(true);
    setError(null);

    try {
      const updatedProject = await toggleProjectFeaturedRequest(
        projectId,
        featured,
      );

      setProjects((currentProjects) =>
        currentProjects.map((currentProject) =>
          currentProject.id === projectId ? updatedProject : currentProject,
        ),
      );

      return updatedProject;
    } catch (requestError) {
      console.error("Erro ao alterar destaque:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    projects,
    isLoading,
    isMutating,
    error,
    reloadProjects: loadProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleFeatured,
  };
}
