import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeviceToolbar from "../components/DeviceToolbar";
import SectionInspector from "../components/SectionInspector";
import SectionsPanel from "../components/SectionsPanel";
import { useVisualEditor } from "../hooks/useVisualEditor";

const PREVIEW_URL =
  import.meta.env.VITE_PORTFOLIO_PREVIEW_URL ||
  "https://gabrielnt0.github.io/portfolio/";

const deviceWidths = {
  desktop: "1440px",
  laptop: "1180px",
  tablet: "768px",
  mobile: "390px",
};

const zoomSteps = [50, 67, 75, 90, 100, 110, 125];

function formatSavedTime(date) {
  if (!date) return "Ainda não salvo nesta sessão";

  return `Salvo às ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function VisualEditorPage() {
  const {
    iframeRef,
    settings,
    selectedSectionId,
    device,
    isLoading,
    isSaving,
    isPreviewReady,
    isDirty,
    lastSavedAt,
    update,
    toggle,
    toggleSection,
    moveSection,
    selectSection,
    changeDevice,
    save,
    resetUnsaved,
    handlePreviewLoad,
    markPreviewReloading,
  } = useVisualEditor({ previewUrl: PREVIEW_URL });

  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState(75);
  const [isLayersOpen, setIsLayersOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const selectedSection = useMemo(
    () =>
      settings.sections.find(
        (section) => section.id === selectedSectionId,
      ),
    [selectedSectionId, settings.sections],
  );

  function changeZoom(direction) {
    const currentIndex = zoomSteps.indexOf(zoom);
    const nextIndex = Math.min(
      zoomSteps.length - 1,
      Math.max(0, currentIndex + direction),
    );

    setZoom(zoomSteps[nextIndex]);
  }

  function reloadPreview() {
    markPreviewReloading();
    setReloadKey((current) => current + 1);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <LoaderCircle className="mr-3 animate-spin" />
        Carregando Editor Visual...
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-[640px] flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="z-30 flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950 px-3 py-2 lg:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition hover:text-white"
            aria-label="Voltar ao Dashboard"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                Editor Visual
              </h1>
              {isDirty && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  Não salvo
                </span>
              )}
            </div>
            <p className="hidden truncate text-xs text-zinc-600 sm:block">
              {formatSavedTime(lastSavedAt)}
            </p>
          </div>
        </div>

        <div className="order-3 flex w-full items-center justify-center gap-2 lg:order-none lg:w-auto">
          <button
            type="button"
            onClick={() => setIsLayersOpen((current) => !current)}
            className={[
              "rounded-lg border px-3 py-2 text-xs font-medium transition xl:hidden",
              isLayersOpen
                ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400",
            ].join(" ")}
          >
            Seções
          </button>

          <DeviceToolbar device={device} onChange={changeDevice} />

          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950">
            <button
              type="button"
              onClick={() => changeZoom(-1)}
              className="p-2 text-zinc-500 transition hover:text-white"
              aria-label="Diminuir zoom"
            >
              <Minus size={15} />
            </button>
            <span className="min-w-12 text-center text-xs text-zinc-300">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => changeZoom(1)}
              className="p-2 text-zinc-500 transition hover:text-white"
              aria-label="Aumentar zoom"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsInspectorOpen((current) => !current)}
            className={[
              "rounded-lg border px-3 py-2 text-xs font-medium transition xl:hidden",
              isInspectorOpen
                ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400",
            ].join(" ")}
          >
            Propriedades
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={[
              "hidden items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs md:flex",
              isPreviewReady
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                : "border-amber-500/20 bg-amber-500/5 text-amber-400",
            ].join(" ")}
            title={
              isPreviewReady
                ? "Preview conectado"
                : "Aguardando conexão com o site"
            }
          >
            {isPreviewReady ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isPreviewReady ? "Conectado" : "Conectando"}
          </div>

          <button
            type="button"
            onClick={reloadPreview}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:text-white"
            aria-label="Recarregar preview"
            title="Recarregar preview"
          >
            <RefreshCw size={17} />
          </button>

          <button
            type="button"
            onClick={resetUnsaved}
            disabled={!isDirty}
            className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
          >
            <RotateCcw size={16} />
            Descartar
          </button>

          <a
            href={PREVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 sm:flex"
          >
            <ExternalLink size={16} />
            Abrir site
          </a>

          <button
            type="button"
            onClick={save}
            disabled={isSaving || !isDirty}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : isDirty ? (
              <Save size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {isSaving ? "Salvando" : isDirty ? "Salvar" : "Salvo"}
          </button>
        </div>
      </header>

      <div
        className={[
          "grid min-h-0 flex-1",
          isLayersOpen && isInspectorOpen
            ? "xl:grid-cols-[250px_minmax(0,1fr)_310px]"
            : isLayersOpen
              ? "xl:grid-cols-[250px_minmax(0,1fr)]"
              : isInspectorOpen
                ? "xl:grid-cols-[minmax(0,1fr)_310px]"
                : "grid-cols-1",
        ].join(" ")}
      >
        {isLayersOpen && (
          <aside className="absolute inset-y-16 left-0 z-20 w-72 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4 shadow-2xl xl:static xl:inset-auto xl:w-auto xl:shadow-none">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Seções
              </p>
              <span className="text-xs text-zinc-700">
                {settings.sections.length}
              </span>
            </div>

            <SectionsPanel
              sections={settings.sections}
              selectedSectionId={selectedSectionId}
              onSelect={(sectionId) => {
                selectSection(sectionId);
                if (window.innerWidth < 1280) setIsLayersOpen(false);
              }}
              onToggle={toggleSection}
              onMove={moveSection}
            />
          </aside>
        )}

        <main className="min-w-0 overflow-hidden bg-zinc-900">
          <div className="flex h-full min-h-0 items-start justify-center overflow-auto p-4 lg:p-6">
            <div
              className="origin-top overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-[width,transform] duration-300"
              style={{
                width: deviceWidths[device],
                maxWidth: device === "desktop" ? "none" : "100%",
                height: `${100 / (zoom / 100)}%`,
                minHeight: `${720 / (zoom / 100)}px`,
                transform: `scale(${zoom / 100})`,
              }}
            >
              <iframe
                key={reloadKey}
                ref={iframeRef}
                src={`${PREVIEW_URL}?visualEditor=1`}
                title="Preview do portfólio"
                className="h-full min-h-[720px] w-full border-0"
                onLoad={handlePreviewLoad}
              />
            </div>
          </div>
        </main>

        {isInspectorOpen && (
          <aside className="absolute inset-y-16 right-0 z-20 w-80 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-5 shadow-2xl xl:static xl:inset-auto xl:w-auto xl:shadow-none">
            <SectionInspector
              section={selectedSection}
              settings={settings}
              update={update}
              toggle={toggle}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
