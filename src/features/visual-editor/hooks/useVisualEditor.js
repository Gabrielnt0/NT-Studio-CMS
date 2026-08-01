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
import { listMedia } from "../../media/services/media.service";
import {
  getProfile,
  upsertProfile,
} from "../../profile/services/profile.service";
import {
  DEFAULT_THEME,
  getCurrentTheme,
  saveCurrentTheme,
} from "../../theme/services/theme.service";
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

const EMPTY_SECTION_STYLE = Object.freeze({
  backgroundColor: "",
  textColor: "",
  backgroundImage: "",
  backgroundOverlay: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginTop: 0,
  marginBottom: 0,
  borderColor: "",
  borderWidth: 0,
  borderRadius: 0,
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

function createThemeDefaults(theme = null) {
  const current = { ...DEFAULT_THEME, ...(theme || {}) };
  return {
    ...current,
    settings: {
      ...(current.settings || {}),
      sectionStyles: {
        ...(current.settings?.sectionStyles || {}),
      },
    },
  };
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
  const [theme, setTheme] = useState(createThemeDefaults);
  const [savedTheme, setSavedTheme] = useState(createThemeDefaults);
  const [media, setMedia] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("inicio");
  const [device, setDevice] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [historySize, setHistorySize] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(
    () => window.localStorage.getItem("portfolio-visual-autosave") === "true",
  );

  const historyRef = useRef([]);
  const historyTimerRef = useRef(null);
  const skipHistoryRef = useRef(false);

  const previewOrigin = useMemo(() => getPreviewOrigin(previewUrl), [previewUrl]);

  const createSnapshot = useCallback(
    () => ({
      settings: structuredClone(settings),
      profile: structuredClone(profile),
      theme: structuredClone(theme),
    }),
    [profile, settings, theme],
  );

  const applySnapshot = useCallback((snapshot) => {
    if (!snapshot) return;
    skipHistoryRef.current = true;
    setSettings(structuredClone(snapshot.settings));
    setProfile(structuredClone(snapshot.profile));
    setTheme(structuredClone(snapshot.theme));
  }, []);

  const isDirty = useMemo(
    () =>
      JSON.stringify(settings) !== JSON.stringify(savedSettings) ||
      JSON.stringify(profile) !== JSON.stringify(savedProfile) ||
      JSON.stringify(theme) !== JSON.stringify(savedTheme),
    [profile, savedProfile, savedSettings, savedTheme, settings, theme],
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
    Promise.all([
      getCurrentBuilderSettings(),
      getProfile(),
      getCurrentTheme(),
      listMedia().catch((error) => {
        console.warn("Não foi possível carregar a Biblioteca de Mídia.", error);
        return [];
      }),
    ])
      .then(([builderData, profileData, themeData, mediaData]) => {
        const normalizedProfile = createProfileDefaults(profileData);
        const normalizedTheme = createThemeDefaults(themeData);

        setSettings(builderData);
        setSavedSettings(builderData);
        setProfile(normalizedProfile);
        setSavedProfile(normalizedProfile);
        setTheme(normalizedTheme);
        setSavedTheme(normalizedTheme);
        setMedia(mediaData);

        const initialSnapshot = {
          settings: structuredClone(builderData),
          profile: structuredClone(normalizedProfile),
          theme: structuredClone(normalizedTheme),
        };
        historyRef.current = [initialSnapshot];
        setHistoryIndex(0);
        setHistorySize(1);

        const timestamps = [
          builderData?.updatedAt,
          profileData?.updatedAt,
          themeData?.updatedAt,
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
        sendToPreview(previewMessageTypes.applyTheme, { theme });
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
  }, [previewOrigin, profile, selectedSectionId, sendToPreview, settings, theme]);

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
    sendToPreview(previewMessageTypes.applyTheme, { theme });
  }, [isPreviewReady, sendToPreview, theme]);

  useEffect(() => {
    if (!isPreviewReady) return;
    sendToPreview(previewMessageTypes.selectSection, { sectionId: selectedSectionId });
  }, [isPreviewReady, selectedSectionId, sendToPreview]);

  useEffect(() => {
    if (isLoading || historyIndex < 0) return;

    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }

    window.clearTimeout(historyTimerRef.current);
    historyTimerRef.current = window.setTimeout(() => {
      const nextSnapshot = createSnapshot();
      const currentSnapshot = historyRef.current[historyIndex];

      if (
        currentSnapshot &&
        JSON.stringify(currentSnapshot) === JSON.stringify(nextSnapshot)
      ) {
        return;
      }

      const nextHistory = historyRef.current
        .slice(0, historyIndex + 1)
        .concat(nextSnapshot)
        .slice(-50);

      historyRef.current = nextHistory;
      setHistorySize(nextHistory.length);
      setHistoryIndex(nextHistory.length - 1);
    }, 450);

    return () => window.clearTimeout(historyTimerRef.current);
  }, [
    createSnapshot,
    historyIndex,
    isLoading,
    profile,
    settings,
    theme,
  ]);

  const canUndo = historyIndex > 0;
  const canRedo =
    historyIndex >= 0 && historyIndex < historySize - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    const nextIndex = historyIndex - 1;
    applySnapshot(historyRef.current[nextIndex]);
    setHistoryIndex(nextIndex);
  }, [applySnapshot, canUndo, historyIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    applySnapshot(historyRef.current[nextIndex]);
    setHistoryIndex(nextIndex);
  }, [applySnapshot, canRedo, historyIndex]);

  useEffect(() => {
    function handleKeyboard(event) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTyping) return;
      if (!(event.ctrlKey || event.metaKey)) return;

      if (event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      }

      if (
        event.key.toLowerCase() === "y" ||
        (event.key.toLowerCase() === "z" && event.shiftKey)
      ) {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [redo, undo]);

  useEffect(() => {
    window.localStorage.setItem(
      "portfolio-visual-autosave",
      String(autoSaveEnabled),
    );
  }, [autoSaveEnabled]);

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

  const updateTheme = useCallback((field, value) => {
    setTheme((current) => ({ ...current, [field]: value }));
  }, []);

  const updateSectionStyle = useCallback((sectionId, field, value) => {
    setTheme((current) => ({
      ...current,
      settings: {
        ...(current.settings || {}),
        sectionStyles: {
          ...(current.settings?.sectionStyles || {}),
          [sectionId]: {
            ...EMPTY_SECTION_STYLE,
            ...(current.settings?.sectionStyles?.[sectionId] || {}),
            [field]: value,
          },
        },
      },
    }));
  }, []);

  const resetSectionStyle = useCallback((sectionId) => {
    setTheme((current) => {
      const nextStyles = { ...(current.settings?.sectionStyles || {}) };
      delete nextStyles[sectionId];
      return {
        ...current,
        settings: { ...(current.settings || {}), sectionStyles: nextStyles },
      };
    });
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

  const selectSection = useCallback((sectionId, shouldScroll = true) => {
    setSelectedSectionId(sectionId);
    if (shouldScroll) {
      sendToPreview(previewMessageTypes.scrollToSection, { sectionId });
    }
  }, [sendToPreview]);

  const changeDevice = useCallback((nextDevice) => setDevice(nextDevice), []);

  const save = useCallback(async ({ silent = false } = {}) => {
    setIsSaving(true);
    try {
      const [savedBuilder, savedProfileData, savedThemeData] = await Promise.all([
        saveCurrentBuilderSettings(settings),
        upsertProfile(profile),
        saveCurrentTheme(theme),
      ]);

      const normalizedProfile = createProfileDefaults(savedProfileData);
      const normalizedTheme = createThemeDefaults(savedThemeData);
      setSettings(savedBuilder);
      setSavedSettings(savedBuilder);
      setProfile(normalizedProfile);
      setSavedProfile(normalizedProfile);
      setTheme(normalizedTheme);
      setSavedTheme(normalizedTheme);
      setLastSavedAt(new Date());
      if (!silent) {
        toast.success("Conteúdo, aparência e layout salvos.");
      }
      return { settings: savedBuilder, profile: normalizedProfile, theme: normalizedTheme };
    } catch (error) {
      console.error("Erro ao salvar Editor Visual:", error);
      toast.error(error.message || "Não foi possível salvar as alterações.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [profile, settings, theme]);

  useEffect(() => {
    if (!autoSaveEnabled || !isDirty || isSaving || isLoading) return;

    const timer = window.setTimeout(() => {
      save({ silent: true }).catch(() => {});
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [
    autoSaveEnabled,
    isDirty,
    isLoading,
    isSaving,
    save,
  ]);

  const resetUnsaved = useCallback(() => {
    setSettings(savedSettings);
    setProfile(savedProfile);
    setTheme(savedTheme);
    toast.success("Alterações não salvas foram descartadas.");
  }, [savedProfile, savedSettings, savedTheme]);

  const handlePreviewLoad = useCallback(() => {
    setIsPreviewReady(false);
    window.setTimeout(() => sendToPreview(previewMessageTypes.ping), 100);
  }, [sendToPreview]);

  const markPreviewReloading = useCallback(() => setIsPreviewReady(false), []);

  return {
    iframeRef,
    settings,
    profile,
    theme,
    media,
    selectedSectionId,
    device,
    isLoading,
    isSaving,
    isPreviewReady,
    isDirty,
    lastSavedAt,
    canUndo,
    canRedo,
    autoSaveEnabled,
    update,
    toggle,
    updateProfile,
    toggleProfile,
    updateTheme,
    updateSectionStyle,
    resetSectionStyle,
    toggleSection,
    moveSection,
    selectSection,
    changeDevice,
    undo,
    redo,
    setAutoSaveEnabled,
    save,
    resetUnsaved,
    handlePreviewLoad,
    markPreviewReloading,
  };
}
