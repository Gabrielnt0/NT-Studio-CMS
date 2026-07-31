import { useCallback, useEffect, useState } from "react";
import {
  getProfile,
  upsertProfile as upsertProfileRequest,
} from "../services/profile.service";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProfile();
      setProfile(data);
    } catch (requestError) {
      console.error("Erro ao carregar perfil:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const upsertProfile = useCallback(async (profileData) => {
    setIsMutating(true);
    setError(null);

    try {
      const savedProfile = await upsertProfileRequest(profileData);
      setProfile(savedProfile);
      return savedProfile;
    } catch (requestError) {
      console.error("Erro ao salvar perfil:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    isMutating,
    error,
    reloadProfile: loadProfile,
    upsertProfile,
  };
}
