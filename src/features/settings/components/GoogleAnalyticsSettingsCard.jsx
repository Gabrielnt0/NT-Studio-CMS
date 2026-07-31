import { RefreshCw, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  getPortfolioSettings,
  saveGoogleAnalyticsSettings,
  syncGoogleAnalyticsSettings,
  testGoogleAnalyticsSettings,
} from "../services/portfolioSettings.service";

function formatDate(value) {
  if (!value) return "Nunca";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export default function GoogleAnalyticsSettingsCard() {
  const [form, setForm] = useState({ enabled: false, measurementId: "", propertyId: "" });
  const [status, setStatus] = useState("pending");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isTesting, setTesting] = useState(false);
  const [isSyncing, setSyncing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const settings = await getPortfolioSettings();
      if (settings) {
        setForm({
          enabled: Boolean(settings.google_analytics_enabled),
          measurementId: settings.google_analytics_measurement_id ?? "",
          propertyId: settings.google_analytics_property_id ?? "",
        });
        setStatus(settings.google_analytics_connection_status ?? "pending");
        setLastSyncedAt(settings.google_analytics_last_synced_at ?? null);
        setLastError(settings.google_analytics_last_error ?? null);
      }
    } catch (error) {
      toast.error(error.message || "Não foi possível carregar as configurações.");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  async function save(event) {
    event.preventDefault();
    if (form.enabled && !/^\d+$/.test(form.propertyId.trim())) {
      toast.error("Informe um Property ID GA4 contendo apenas números.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveGoogleAnalyticsSettings(form);
      setStatus(saved.google_analytics_connection_status ?? "pending");
      setLastError(null);
      toast.success("Configurações do Analytics salvas.");
    } catch (error) { toast.error(error.message || "Não foi possível salvar."); }
    finally { setSaving(false); }
  }

  async function testConnection() {
    setTesting(true);
    try {
      const response = await testGoogleAnalyticsSettings();
      setStatus("connected"); setLastError(null);
      toast.success(response.message || "Conexão confirmada.");
    } catch (error) { setStatus("error"); setLastError(error.message); toast.error(error.message); }
    finally { setTesting(false); }
  }

  async function sync() {
    setSyncing(true);
    try {
      const response = await syncGoogleAnalyticsSettings();
      setStatus("connected"); setLastSyncedAt(response.lastSyncedAt ?? new Date().toISOString()); setLastError(null);
      toast.success(response.message || "Métricas sincronizadas.");
    } catch (error) { setStatus("error"); setLastError(error.message); toast.error(error.message); }
    finally { setSyncing(false); }
  }

  if (isLoading) return <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">Carregando configurações do Analytics...</section>;

  const statusLabel = status === "connected" ? "Conectado" : status === "error" ? "Erro" : "Pendente";
  const statusClass = status === "connected" ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : status === "error" ? "text-red-300 bg-red-500/10 border-red-500/20" : "text-amber-300 bg-amber-500/10 border-amber-500/20";

  return <form onSubmit={save} className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div><h2 className="text-xl font-semibold text-white">Google Analytics 4</h2><p className="mt-1 text-sm text-zinc-400">Configure a única propriedade usada pelo seu portfólio.</p></div>
      <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
    </div>

    <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <input type="checkbox" checked={form.enabled} onChange={(event) => update("enabled", event.target.checked)} className="h-4 w-4 accent-blue-600" />
      <span><span className="block text-sm font-medium text-zinc-200">Ativar Google Analytics</span><span className="block text-xs text-zinc-500">Habilita testes e sincronizações no dashboard Analytics.</span></span>
    </label>

    <div className="grid gap-4 md:grid-cols-2">
      <Input label="Measurement ID" placeholder="G-XXXXXXXXXX" value={form.measurementId} onChange={(event) => update("measurementId", event.target.value)} />
      <Input label="Property ID" placeholder="123456789" inputMode="numeric" value={form.propertyId} onChange={(event) => update("propertyId", event.target.value.replace(/\D/g, ""))} />
    </div>

    <div className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm md:grid-cols-2">
      <div><p className="text-xs text-zinc-500">Última sincronização</p><p className="mt-1 text-zinc-200">{formatDate(lastSyncedAt)}</p></div>
      <div><p className="text-xs text-zinc-500">Segurança</p><p className="mt-1 flex items-center gap-2 text-zinc-200"><ShieldCheck size={16} className="text-emerald-400" />Credenciais somente nos Secrets do Supabase</p></div>
    </div>

    {lastError && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{lastError}</p>}

    <div className="flex flex-wrap justify-end gap-2">
      <Button type="button" variant="secondary" onClick={testConnection} disabled={!form.enabled || isSaving || isTesting || isSyncing}>{isTesting ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}{isTesting ? "Testando..." : "Testar conexão"}</Button>
      <Button type="button" variant="secondary" onClick={sync} disabled={!form.enabled || status !== "connected" || isSaving || isTesting || isSyncing}><RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />{isSyncing ? "Sincronizando..." : "Sincronizar"}</Button>
      <Button type="submit" disabled={isSaving || isTesting || isSyncing}><Save size={16} />{isSaving ? "Salvando..." : "Salvar"}</Button>
    </div>
  </form>;
}
