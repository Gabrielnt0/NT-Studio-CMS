import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  DEFAULT_BUILDER_SETTINGS,
  DEFAULT_SECTIONS,
  getCurrentBuilderSettings,
  saveCurrentBuilderSettings,
} from "../../builder/services/builder.service";
import {
  getProfile,
  upsertProfile,
} from "../../profile/services/profile.service";
import {
  createPreviewMessage,
  isPreviewMessage,
  previewMessageTypes,
} from "../utils/previewMessages";

const EMPTY_PROFILE = Object.freeze({
  fullName: "",
  professionalTitle: "",
  shortBio: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  resumeUrl: "",
  avatarUrl: "",
  availableForWork: false,
  isPublic: true,
});

function createBuilderDefaults() {
  return {
    ...DEFAULT_BUILDER_SETTINGS,
    sections: DEFAULT_SECTIONS.map((section) => ({ ...section })),
  };
}

function createProfileDefaults(profile = null) {
  return { ...EMPTY_PROFILE, ...(profile || {}) };
}

function getPreviewOrigin(previewUrl) {
  try {
    return new URL(previewUrl).origin;
  } catch {
    return "*";
  }
}

export function useVisualEditor({ previewUrl }) {
  const iframeRef = useRef(null);

  const [settings, setSettings] = useState(createBuilderDefaults);
  const [savedSettings, setSavedSettings] = useState(createBuilderDefaults);
  const [profile, setProfile] = useState(createProfileDefaults);
  const [savedProfile, setSavedProfile] = useState(createProfileDefaults);

  const [selectedSectionId, setSelectedSectionId] = useState("inicio");
  const [device, setDevice] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const previewOrigin = useMemo(
    () => getPreviewOrigin(previewUrl),
    [previewUrl],
  );

  const isDirty = useMemo(
    () =>
      JSON.stringify(settings) !== JSON.stringify(savedSettings) ||
      JSON.stringify(profile) !== JSON.stringify(savedProfile),
    [profile, savedProfile, savedSettings, settings],
  );

  const sendToPreview = useCallback(
    (type, payload = {}) => {
      iframeRef.current?.contentWindow?.postMessage(
        createPreviewMessage(type, payload),
        previewOrigin,
      );
    },
    [previewOrigin],
  );

  useEffect(() => {
    Promise.all([getCurrentBuilderSettings(), getProfile()])
      .then(([builderData, profileData]) => {
        const normalizedProfile = createProfileDefaults(profileData);

        setSettings(builderData);
        setSavedSettings(builderData);
        setProfile(normalizedProfile);
        setSavedProfile(normalizedProfile);

        const timestamps = [
          builderData?.updatedAt,
          profileData?.updatedAt,
        ]
          .filter(Boolean)
          .map((value) => new Date(value))
          .filter((date) => !Number.isNaN(date.getTime()));

        if (timestamps.length) {
          setLastSavedAt(
            new Date(Math.max(...timestamps.map((date) => date.getTime()))),
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar Editor Visual:", error);
        toast.error(error.message || "Não foi possível carregar o editor.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (!isPreviewMessage(event)) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (previewOrigin !== "*" && event.origin !== previewOrigin) return;

      if (event.data.type === previewMessageTypes.ready) {
        setIsPreviewReady(true);
        sendToPreview(previewMessageTypes.applySettings, { settings });
        sendToPreview(previewMessageTypes.applyProfile, { profile });
        sendToPreview(previewMessageTypes.selectSection, {
          sectionId: selectedSectionId,
        });
      }

      if (event.data.type === previewMessageTypes.sectionSelected) {
        setSelectedSectionId(event.data.payload?.sectionId || "inicio");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    previewOrigin,
    profile,
    selectedSectionId,
    sendToPreview,
    settings,
  ]);

  useEffect(() => {
    if (!isPreviewReady) return;
    sendToPreview(previewMessageTypes.applySettings, { settings });
  }, [isPreviewReady, sendToPreview, settings]);

  useEffect(() => {
    if (!isPreviewReady) return;
    sendToPreview(previewMessageTypes.applyProfile, { profile });
  }, [isPreviewReady, profile, sendToPreview]);

  useEffect(() => {
    if (!isPreviewReady) return;

    sendToPreview(previewMessageTypes.selectSection, {
      sectionId: selectedSectionId,
    });
  }, [isPreviewReady, selectedSectionId, sendToPreview]);

  useEffect(() => {
    function handleBeforeUnload(event) {
      if (!isDirty) return;

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const update = useCallback((field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
  }, []);

  const toggle = useCallback((field) => {
    setSettings((current) => ({ ...current, [field]: !current[field] }));
  }, []);

  const updateProfile = useCallback((field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  }, []);

  const toggleProfile = useCallback((field) => {
    setProfile((current) => ({ ...current, [field]: !current[field] }));
  }, []);

  const toggleSection = useCallback((sectionId) => {
    setSettings((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section,
      ),
    }));
  }, []);

  const moveSection = useCallback((sourceId, targetId) => {
    if (!sourceId || sourceId === targetId) return;

    setSettings((current) => {
      const sections = [...current.sections];
      const sourceIndex = sections.findIndex((item) => item.id === sourceId);
      const targetIndex = sections.findIndex((item) => item.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0) return current;

      const [moved] = sections.splice(sourceIndex, 1);
      sections.splice(targetIndex, 0, moved);

      return { ...current, sections };
    });
  }, []);

  const selectSection = useCallback(
    (sectionId, shouldScroll = true) => {
      setSelectedSectionId(sectionId);

      if (shouldScroll) {
        sendToPreview(previewMessageTypes.scrollToSection, { sectionId });
      }
    },
    [sendToPreview],
  );

  const changeDevice = useCallback((nextDevice) => {
    setDevice(nextDevice);
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);

    try {
      const [savedBuilder, savedProfileData] = await Promise.all([
        saveCurrentBuilderSettings(settings),
        upsertProfile(profile),
      ]);

      const normalizedProfile = createProfileDefaults(savedProfileData);

      setSettings(savedBuilder);
      setSavedSettings(savedBuilder);
      setProfile(normalizedProfile);
      setSavedProfile(normalizedProfile);
      setLastSavedAt(new Date());

      toast.success("Conteúdo e layout salvos.");
      return { settings: savedBuilder, profile: normalizedProfile };
    } catch (error) {
      console.error("Erro ao salvar Editor Visual:", error);
      toast.error(error.message || "Não foi possível salvar as alterações.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [profile, settings]);

  const resetUnsaved = useCallback(() => {
    setSettings(savedSettings);
    setProfile(savedProfile);
    toast.success("Alterações não salvas foram descartadas.");
  }, [savedProfile, savedSettings]);

  const handlePreviewLoad = useCallback(() => {
    setIsPreviewReady(false);

    window.setTimeout(() => {
      sendToPreview(previewMessageTypes.ping);
    }, 100);
  }, [sendToPreview]);

  const markPreviewReloading = useCallback(() => {
    setIsPreviewReady(false);
  }, []);

  return {
    iframeRef,
    settings,
    profile,
    selectedSectionId,
    device,
    isLoading,
    isSaving,
    isPreviewReady,
    isDirty,
    lastSavedAt,
    update,
    toggle,
    updateProfile,
    toggleProfile,
    toggleSection,
    moveSection,
    selectSection,
    changeDevice,
    save,
    resetUnsaved,
    handlePreviewLoad,
    markPreviewReloading,
  };
}
