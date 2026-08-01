import {
  CheckCircle2,
  Eye,
  EyeOff,
  GripVertical,
  LayoutTemplate,
  LoaderCircle,
  Monitor,
  RotateCcw,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import {
  applyBuilderPreset,
  BUILDER_PRESETS,
  DEFAULT_BUILDER_SETTINGS,
  DEFAULT_SECTIONS,
  getCurrentBuilderSettings,
  saveCurrentBuilderSettings,
} from "../services/builder.service";

function createDefaults() {
  return {
    ...DEFAULT_BUILDER_SETTINGS,
    sections: DEFAULT_SECTIONS.map((item) => ({ ...item })),
  };
}

export default function BuilderPage() {
  const [settings, setSettings] = useState(createDefaults);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    getCurrentBuilderSettings()
      .then(setSettings)
      .catch((error) => {
        console.error("Erro ao carregar Site Builder:", error);
        toast.error(error.message || "Não foi possível carregar o Site Builder.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function update(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function updateBoolean(field) {
    setSettings((current) => ({ ...current, [field]: !current[field] }));
  }

  function applyPreset(presetId) {
    setSettings((current) => applyBuilderPreset(current, presetId));
  }

  function toggleSection(id) {
    setSettings((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id
          ? { ...section, enabled: !section.enabled }
          : section,
      ),
    }));
  }

  function moveSection(sourceId, targetId) {
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
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      const saved = await saveCurrentBuilderSettings(settings);
      setSettings(saved);
      toast.success("Estrutura do site salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar Site Builder:", error);
      toast.error(error.message || "Não foi possível salvar a estrutura.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="flex min-h-[420px] items-center justify-center p-8 text-zinc-400">
        <LoaderCircle className="mr-3 animate-spin" />
        Carregando Site Builder...
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-400">
            <LayoutTemplate size={17} />
            Estrutura pública
          </div>
          <h1 className="text-3xl font-bold text-white">Site Builder</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Organize as seções e configure a apresentação do seu portfólio sem
            alterar o código do site.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSettings(createDefaults())}
          >
            <RotateCcw size={17} />
            Restaurar
          </Button>

          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            Salvar estrutura
          </Button>
        </div>
      </header>

      <Card className="p-6">
        <h2 className="font-semibold text-white">Presets de layout</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Escolha uma base e personalize as opções abaixo.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(BUILDER_PRESETS).map(([id, preset]) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className={[
                "rounded-xl border p-4 text-left transition",
                settings.preset === id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700",
              ].join(" ")}
            >
              <p className="font-medium text-zinc-100">{preset.label}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {preset.heroLayout} · {preset.cardStyle} ·{" "}
                {preset.projectsColumns} colunas
              </p>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-8 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Ordem e visibilidade
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Arraste os blocos para ordenar e use o botão de olho para ocultar.
            </p>

            <div className="mt-5 space-y-3">
              {settings.sections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => setDraggedId(section.id)}
                  onDragEnd={() => setDraggedId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveSection(draggedId, section.id)}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                    draggedId === section.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 bg-zinc-950",
                  ].join(" ")}
                >
                  <GripVertical
                    size={18}
                    className="cursor-grab text-zinc-600"
                  />
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-zinc-500">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        section.enabled ? "text-zinc-100" : "text-zinc-500"
                      }
                    >
                      {section.label}
                    </p>
                    <p className="text-xs text-zinc-600">#{section.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={[
                      "rounded-lg p-2 transition",
                      section.enabled
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-zinc-900 text-zinc-600",
                    ].join(" ")}
                    aria-label={
                      section.enabled
                        ? `Ocultar ${section.label}`
                        : `Exibir ${section.label}`
                    }
                  >
                    {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Layout geral</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SelectField
                label="Hero"
                value={settings.heroLayout}
                onChange={(value) => update("heroLayout", value)}
                options={[
                  ["split", "Dividido"],
                  ["centered", "Centralizado"],
                  ["fullscreen", "Tela cheia"],
                ]}
              />
              <SelectField
                label="Largura do conteúdo"
                value={settings.containerWidth}
                onChange={(value) => update("containerWidth", value)}
                options={[
                  ["compact", "Compacta"],
                  ["wide", "Ampla"],
                  ["full", "Máxima"],
                ]}
              />
              <SelectField
                label="Espaçamento"
                value={settings.sectionSpacing}
                onChange={(value) => update("sectionSpacing", value)}
                options={[
                  ["compact", "Compacto"],
                  ["comfortable", "Confortável"],
                  ["spacious", "Espaçoso"],
                ]}
              />
              <SelectField
                label="Alinhamento"
                value={settings.contentAlignment}
                onChange={(value) => update("contentAlignment", value)}
                options={[
                  ["left", "À esquerda"],
                  ["center", "Centralizado"],
                ]}
              />
              <SelectField
                label="Cards"
                value={settings.cardStyle}
                onChange={(value) => update("cardStyle", value)}
                options={[
                  ["flat", "Flat"],
                  ["rounded", "Arredondado"],
                  ["glass", "Glass"],
                  ["outline", "Outline"],
                ]}
              />
              <SelectField
                label="Botões"
                value={settings.buttonStyle}
                onChange={(value) => update("buttonStyle", value)}
                options={[
                  ["square", "Quadrado"],
                  ["rounded", "Arredondado"],
                  ["pill", "Pill"],
                  ["outline", "Outline"],
                ]}
              />
              <SelectField
                label="Navbar"
                value={settings.navbarStyle}
                onChange={(value) => update("navbarStyle", value)}
                options={[
                  ["solid", "Sólida"],
                  ["transparent", "Transparente"],
                  ["blur", "Com desfoque"],
                ]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Hero</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ToggleField
                label="Mostrar avatar"
                checked={settings.showHeroAvatar}
                onChange={() => updateBoolean("showHeroAvatar")}
              />
              <ToggleField
                label="Botão de currículo"
                checked={settings.showResumeButton}
                onChange={() => updateBoolean("showResumeButton")}
              />
              <ToggleField
                label="Botão de contato"
                checked={settings.showContactButton}
                onChange={() => updateBoolean("showContactButton")}
              />
              <ToggleField
                label="Redes sociais"
                checked={settings.showSocialLinks}
                onChange={() => updateBoolean("showSocialLinks")}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Projetos</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SelectField
                label="Colunas"
                value={String(settings.projectsColumns)}
                onChange={(value) => update("projectsColumns", Number(value))}
                options={[
                  ["2", "2 colunas"],
                  ["3", "3 colunas"],
                  ["4", "4 colunas"],
                ]}
              />
              <Input
                label="Projetos por página"
                type="number"
                min="1"
                max="24"
                value={settings.projectsPerPage}
                onChange={(event) =>
                  update("projectsPerPage", Number(event.target.value))
                }
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ToggleField
                label="Mostrar filtros"
                checked={settings.showProjectFilters}
                onChange={() => updateBoolean("showProjectFilters")}
              />
              <ToggleField
                label="Mostrar tecnologias"
                checked={settings.showProjectTechnologies}
                onChange={() => updateBoolean("showProjectTechnologies")}
              />
              <ToggleField
                label="Mostrar cliente"
                checked={settings.showProjectClient}
                onChange={() => updateBoolean("showProjectClient")}
              />
              <ToggleField
                label="Mostrar data"
                checked={settings.showProjectDate}
                onChange={() => updateBoolean("showProjectDate")}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Habilidades e rodapé
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SelectField
                label="Visual das habilidades"
                value={settings.skillsLayout}
                onChange={(value) => update("skillsLayout", value)}
                options={[
                  ["cards", "Cards"],
                  ["bars", "Barras"],
                  ["list", "Lista"],
                ]}
              />
              <Input
                label="Texto do rodapé"
                value={settings.footerText}
                onChange={(event) => update("footerText", event.target.value)}
                placeholder="© 2026 Gabriel"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ToggleField
                label="Agrupar por categoria"
                checked={settings.groupSkillsByCategory}
                onChange={() => updateBoolean("groupSkillsByCategory")}
              />
              <ToggleField
                label="Redes no rodapé"
                checked={settings.showFooterSocialLinks}
                onChange={() => updateBoolean("showFooterSocialLinks")}
              />
              <ToggleField
                label="Botão voltar ao topo"
                checked={settings.showBackToTop}
                onChange={() => updateBoolean("showBackToTop")}
              />
            </div>
          </Card>
        </div>

        <aside className="2xl:sticky 2xl:top-24 2xl:self-start">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Monitor size={17} className="text-blue-400" />
            Pré-visualização estrutural
          </div>

          <BuilderPreview settings={settings} />

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-200">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            O preview representa a estrutura. Cores e tipografia continuam sendo
            controladas na página Aparência.
          </div>
        </aside>
      </div>
    </div>
  );
}

function BuilderPreview({ settings }) {
  const visibleSections = settings.sections.filter(
    (section) => section.enabled && section.id !== "inicio",
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div
        className={[
          "mb-4 border border-zinc-800 bg-zinc-900 p-5",
          settings.heroLayout === "fullscreen" ? "min-h-56" : "min-h-36",
          settings.contentAlignment === "center" ? "text-center" : "text-left",
        ].join(" ")}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
          Hero · {settings.heroLayout}
        </span>

        <div className="mt-4 flex items-center gap-4">
          {settings.showHeroAvatar && (
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-zinc-700" />
          )}
          <div className="flex-1">
            <div className="h-3 w-2/3 rounded bg-zinc-700" />
            <div className="mt-2 h-2 w-full rounded bg-zinc-800" />
          </div>
        </div>

        <div
          className={[
            "mt-5 flex flex-wrap gap-2",
            settings.contentAlignment === "center" ? "justify-center" : "",
          ].join(" ")}
        >
          {settings.showContactButton && (
            <PreviewButton settings={settings}>Contato</PreviewButton>
          )}
          {settings.showResumeButton && (
            <PreviewButton settings={settings}>Currículo</PreviewButton>
          )}
        </div>
      </div>

      <div
        className={
          settings.sectionSpacing === "compact"
            ? "space-y-1"
            : settings.sectionSpacing === "spacious"
              ? "space-y-4"
              : "space-y-2"
        }
      >
        {visibleSections.map((section) => (
          <div
            key={section.id}
            className={[
              "border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300",
              settings.cardStyle === "rounded" ||
              settings.cardStyle === "glass"
                ? "rounded-xl"
                : "rounded",
              settings.cardStyle === "glass" ? "bg-white/5" : "",
            ].join(" ")}
          >
            {section.label}
            {section.id === "projetos" && (
              <span className="ml-2 text-xs text-zinc-600">
                {settings.projectsColumns} colunas
              </span>
            )}
            {section.id === "competencias" && (
              <span className="ml-2 text-xs text-zinc-600">
                {settings.skillsLayout}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-600">
        {settings.footerText || "Rodapé do portfólio"}
      </div>
    </div>
  );
}

function PreviewButton({ settings, children }) {
  return (
    <span
      className={[
        "bg-blue-600 px-4 py-2 text-xs text-white",
        settings.buttonStyle === "pill"
          ? "rounded-full"
          : settings.buttonStyle === "square"
            ? "rounded"
            : "rounded-xl",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="space-y-2 text-sm text-zinc-300">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}
