import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_WIDGETS = ["sessions", "users", "views", "events", "engagement", "conversions"];
const DEFAULT_BRANDING = {
  reportTitle: "Portfolio Analytics",
  companyName: "Portfolio CMS",
  accent: "blue",
  showPoweredBy: true,
};

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function useAnalyticsWorkspace(projectId, metrics, projectName) {
  const storageKey = `portfolio-analytics-workspace:${projectId || "default"}`;
  const snapshotKey = "portfolio-analytics-snapshots";
  const [widgets, setWidgets] = useState(() => readJson(`${storageKey}:widgets`, DEFAULT_WIDGETS));
  const [branding, setBranding] = useState(() => readJson(`${storageKey}:branding`, DEFAULT_BRANDING));
  const snapshots = useMemo(() => readJson(snapshotKey, {}), [projectId]);

  useEffect(() => {
    if (!projectId || !metrics) return;
    const snapshot = {
      projectId,
      projectName: projectName || "Projeto sem nome",
      savedAt: new Date().toISOString(),
      metrics: {
        activeUsers: Number(metrics.activeUsers || 0),
        sessions: Number(metrics.sessions || 0),
        screenPageViews: Number(metrics.screenPageViews || 0),
        eventCount: Number(metrics.eventCount || 0),
        engagementRate: Number(metrics.engagementRate || 0),
        conversions: Number(metrics.conversions || metrics.keyEvents || 0),
      },
    };
    const current = readJson(snapshotKey, {});
    window.localStorage.setItem(snapshotKey, JSON.stringify({ ...current, [projectId]: snapshot }));
  }, [metrics, projectId, projectName]);

  const updateWidgets = useCallback((nextWidgets) => {
    setWidgets(nextWidgets);
    window.localStorage.setItem(`${storageKey}:widgets`, JSON.stringify(nextWidgets));
  }, [storageKey]);

  const toggleWidget = useCallback((widgetId) => {
    setWidgets((current) => {
      const next = current.includes(widgetId)
        ? current.filter((item) => item !== widgetId)
        : [...current, widgetId];
      window.localStorage.setItem(`${storageKey}:widgets`, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const moveWidget = useCallback((widgetId, direction) => {
    setWidgets((current) => {
      const index = current.indexOf(widgetId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      window.localStorage.setItem(`${storageKey}:widgets`, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const updateBranding = useCallback((patch) => {
    setBranding((current) => {
      const next = { ...current, ...patch };
      window.localStorage.setItem(`${storageKey}:branding`, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const resetWorkspace = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
    setBranding(DEFAULT_BRANDING);
    window.localStorage.removeItem(`${storageKey}:widgets`);
    window.localStorage.removeItem(`${storageKey}:branding`);
  }, [storageKey]);

  return useMemo(() => ({
    widgets,
    branding,
    snapshots,
    toggleWidget,
    moveWidget,
    updateWidgets,
    updateBranding,
    resetWorkspace,
  }), [branding, moveWidget, resetWorkspace, snapshots, toggleWidget, updateBranding, updateWidgets, widgets]);
}
