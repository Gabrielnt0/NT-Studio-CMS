import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAnalyticsOverview, syncAnalytics, testAnalyticsConnection } from "../services/analytics.service";

function mergeRemoteResult(current, response, periodDays, markSynced = false) {
  if (!current) return current;
  return {
    ...current,
    periodDays,
    metrics: response.metrics,
    integration: {
      ...current.integration,
      connection_status: "connected",
      last_synced_at: markSynced ? response.lastSyncedAt : current.integration?.last_synced_at,
      last_error: null,
    },
  };
}

export function useAnalytics() {
  const [overview, setOverview] = useState(null);
  const [periodDays, setPeriodDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const latestRequestId = useRef(0);

  const loadAnalytics = useCallback(async ({ days = 30, silent = false } = {}) => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    if (!silent) setIsLoading(true);
    setError(null);

    try {
      const response = await getAnalyticsOverview({ periodDays: days });
      if (requestId !== latestRequestId.current) return null;
      setOverview(response);
      setPeriodDays(response.periodDays ?? days);
      return response;
    } catch (requestError) {
      if (requestId !== latestRequestId.current) return null;
      console.error("Erro ao carregar Analytics:", requestError);
      setError(requestError);
      return null;
    } finally {
      if (!silent && requestId === latestRequestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadAnalytics({ days: 30 }); }, [loadAnalytics]);

  const changePeriod = useCallback(async (days) => {
    const normalizedDays = Number(days);
    if (!Number.isFinite(normalizedDays) || normalizedDays <= 0 || normalizedDays === periodDays) return;
    setPeriodDays(normalizedDays);
    setNotice("");

    if (!overview?.integration?.enabled || overview?.integration?.connection_status !== "connected") {
      await loadAnalytics({ days: normalizedDays });
      return;
    }

    setIsSyncing(true);
    setError(null);
    try {
      const response = await syncAnalytics(normalizedDays);
      setOverview((current) => mergeRemoteResult(current, response, normalizedDays, true));
      setNotice(`Período atualizado para ${normalizedDays} dias.`);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsSyncing(false);
    }
  }, [loadAnalytics, overview, periodDays]);

  const sync = useCallback(async () => {
    if (!overview?.integration?.enabled) return;
    setIsSyncing(true); setError(null); setNotice("");
    try {
      const response = await syncAnalytics(periodDays);
      setOverview((current) => mergeRemoteResult(current, response, periodDays, true));
      setNotice("Métricas sincronizadas com sucesso.");
    } catch (requestError) { setError(requestError); }
    finally { setIsSyncing(false); }
  }, [overview, periodDays]);

  const testConnection = useCallback(async () => {
    if (!overview?.integration?.enabled) return;
    setIsTesting(true); setError(null); setNotice("");
    try {
      const response = await testAnalyticsConnection(periodDays);
      setOverview((current) => mergeRemoteResult(current, response, periodDays, false));
      setNotice("Conexão com o Google Analytics confirmada.");
    } catch (requestError) { setError(requestError); }
    finally { setIsTesting(false); }
  }, [overview, periodDays]);

  const reloadAnalytics = useCallback(() => loadAnalytics({ days: periodDays }), [loadAnalytics, periodDays]);

  return useMemo(() => ({
    overview,
    analytics: overview,
    periodDays,
    isLoading,
    isSyncing,
    isTesting,
    error,
    notice,
    reloadAnalytics,
    changePeriod,
    sync,
    testConnection,
  }), [overview, periodDays, isLoading, isSyncing, isTesting, error, notice, reloadAnalytics, changePeriod, sync, testConnection]);
}
