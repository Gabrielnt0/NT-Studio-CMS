import { useCallback, useEffect, useState } from "react";
import {
  getSeoSettings,
  saveSeoSettings as saveRequest,
} from "../services/seo.service";
import { EMPTY_SEO_FORM } from "../validation/seo.validation";

export function useSeo() {
  const [seoSettings, setSeoSettings] = useState(EMPTY_SEO_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadSeo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const settings = await getSeoSettings();
      setSeoSettings({ ...EMPTY_SEO_FORM, ...settings });
    } catch (requestError) {
      console.error("Erro ao carregar SEO:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeo();
  }, [loadSeo]);

  const saveSeoSettings = useCallback(async (settings) => {
    setIsSaving(true);
    setError(null);

    try {
      const saved = await saveRequest(settings);
      setSeoSettings({ ...EMPTY_SEO_FORM, ...saved });
      return saved;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    seoSettings,
    isLoading,
    isSaving,
    error,
    reloadSeo: loadSeo,
    saveSeoSettings,
  };
}
