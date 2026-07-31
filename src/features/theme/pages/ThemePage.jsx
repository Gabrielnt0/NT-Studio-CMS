import {
  Check,
  LoaderCircle,
  Palette,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import {
  DEFAULT_THEME,
  getCurrentTheme,
  saveCurrentTheme,
} from "../services/theme.service";

const PRESETS = {
  midnight: {
    label: "Midnight",
    description: "Azul profissional sobre fundo escuro.",
    values: { ...DEFAULT_THEME, preset: "midnight", mode: "dark" },
  },
  emerald: {
    label: "Emerald",
    description: "Verde moderno e elegante.",
    values: {
      ...DEFAULT_THEME,
      preset: "emerald",
      mode: "dark",
      primaryColor: "#10b981",
      primaryHoverColor: "#34d399",
      backgroundColor: "#04110d",
      surfaceColor: "#092019",
      cardColor: "#0b2a20",
      borderColor: "#164e3d",
    },
  },
  violet: {
    label: "Violet",
    description: "Roxo criativo com alto contraste.",
    values: {
      ...DEFAULT_THEME,
      preset: "violet",
      mode: "dark",
      primaryColor: "#8b5cf6",
      primaryHoverColor: "#a78bfa",
      backgroundColor: "#0b0714",
      surfaceColor: "#17102a",
      cardColor: "#1d1534",
      borderColor: "#39265f",
    },
  },
  light: {
    label: "Light",
    description: "Visual claro, limpo e corporativo.",
    values: {
      ...DEFAULT_THEME,
      preset: "light",
      mode: "light",
      primaryColor: "#2563eb",
      primaryHoverColor: "#1d4ed8",
      backgroundColor: "#f8fafc",
      surfaceColor: "#ffffff",
      cardColor: "#ffffff",
      borderColor: "#dbe3ee",
      titleColor: "#0f172a",
      textColor: "#334155",
      mutedColor: "#64748b",
      shadowStyle: "medium",
    },
  },
};

const COLOR_FIELDS = [
  ["primaryColor", "Cor principal"],
  ["primaryHoverColor", "Cor de destaque"],
  ["backgroundColor", "Fundo"],
  ["surfaceColor", "Superfície"],
  ["cardColor", "Cards"],
  ["borderColor", "Bordas"],
  ["titleColor", "Títulos"],
  ["textColor", "Textos"],
  ["mutedColor", "Texto secundário"],
];

function ThemePage() {
  const [theme, setTheme] = useState({ ...DEFAULT_THEME });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCurrentTheme()
      .then(setTheme)
      .catch((error) =>
        toast.error(error.message || "Não foi possível carregar o tema."),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const radius = useMemo(
    () =>
      ({
        square: "4px",
        rounded: "16px",
        pill: "999px",
      })[theme.borderRadius] || "16px",
    [theme.borderRadius],
  );

  const shadow = useMemo(
    () =>
      ({
        none: "none",
        soft: "0 18px 50px rgba(0,0,0,.22)",
        medium: "0 24px 70px rgba(0,0,0,.34)",
      })[theme.shadowStyle] || "none",
    [theme.shadowStyle],
  );

  function update(field, value) {
    setTheme((current) => ({
      ...current,
      [field]: value,
      preset: field === "preset" ? value : "custom",
    }));
  }

  function applyPreset(key) {
    setTheme((current) => ({ ...current, ...PRESETS[key].values }));
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      const saved = await saveCurrentTheme(theme);
      setTheme(saved);
      toast.success("Tema publicado com sucesso.");
    } catch (error) {
      toast.error(error.message || "Não foi possível salvar o tema.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="flex min-h-[420px] items-center justify-center text-zinc-400">
        <LoaderCircle className="mr-3 animate-spin" />
        Carregando aparência...
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-400">
            <Palette size={17} /> Aparência
          </div>
          <h1 className="text-3xl font-bold text-white">Tema do portfólio</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Personalize cores, tipografia, bordas, sombras e animações do seu
            site público.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setTheme({ ...DEFAULT_THEME })}
          >
            <RotateCcw size={17} /> Restaurar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            Publicar tema
          </Button>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Temas rápidos</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`relative rounded-2xl border p-4 text-left transition ${
                theme.preset === key
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
              }`}
            >
              {theme.preset === key && (
                <Check className="absolute right-4 top-4 text-blue-300" size={18} />
              )}
              <div className="mb-4 flex gap-2">
                {[
                  preset.values.backgroundColor,
                  preset.values.surfaceColor,
                  preset.values.primaryColor,
                ].map((color) => (
                  <span
                    key={color}
                    className="h-8 w-8 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="font-semibold text-white">{preset.label}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(420px,.85fr)]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-5 text-lg font-semibold text-white">Cores</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COLOR_FIELDS.map(([field, label]) => (
                <label key={field} className="space-y-2 text-sm text-zinc-300">
                  <span>{label}</span>
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 p-2">
                    <input
                      type="color"
                      value={theme[field]}
                      onChange={(event) => update(field, event.target.value)}
                      className="h-9 w-11 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <input
                      value={theme[field]}
                      onChange={(event) => update(field, event.target.value)}
                      className="min-w-0 flex-1 bg-transparent font-mono text-xs text-zinc-300 outline-none"
                    />
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-lg font-semibold text-white">Estilo</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-zinc-300">
                <span>Tipografia</span>
                <select
                  value={theme.fontFamily}
                  onChange={(event) => update("fontFamily", event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
                >
                  <option>Inter</option>
                  <option>Manrope</option>
                  <option>Poppins</option>
                  <option>Space Grotesk</option>
                  <option>Georgia</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-zinc-300">
                <span>Bordas</span>
                <select
                  value={theme.borderRadius}
                  onChange={(event) => update("borderRadius", event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
                >
                  <option value="square">Discretas</option>
                  <option value="rounded">Arredondadas</option>
                  <option value="pill">Muito arredondadas</option>
                </select>
              </label>

              <label className="space-y-2 text-sm text-zinc-300">
                <span>Sombras</span>
                <select
                  value={theme.shadowStyle}
                  onChange={(event) => update("shadowStyle", event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
                >
                  <option value="none">Sem sombra</option>
                  <option value="soft">Suave</option>
                  <option value="medium">Marcante</option>
                </select>
              </label>

              <label className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                <span>
                  <strong className="block text-zinc-100">Animações</strong>
                  <small className="text-zinc-500">
                    Movimentos e revelações ao rolar
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={theme.motionEnabled}
                  onChange={(event) => update("motionEnabled", event.target.checked)}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>
            </div>
          </Card>
        </div>

        <section className="xl:sticky xl:top-24 xl:self-start">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Sparkles size={17} className="text-blue-400" /> Pré-visualização
          </div>
          <div
            className="overflow-hidden border"
            style={{
              background: theme.backgroundColor,
              borderColor: theme.borderColor,
              borderRadius: radius,
              boxShadow: shadow,
              fontFamily:
                theme.fontFamily === "Georgia"
                  ? "Georgia, serif"
                  : `${theme.fontFamily}, sans-serif`,
            }}
          >
            <div
              className="flex items-center justify-between border-b px-6 py-4"
              style={{
                background: theme.surfaceColor,
                borderColor: theme.borderColor,
              }}
            >
              <strong style={{ color: theme.titleColor }}>Meu Portfólio</strong>
              <div className="flex gap-4 text-xs" style={{ color: theme.mutedColor }}>
                <span>Sobre</span>
                <span>Projetos</span>
                <span>Contato</span>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              <span
                className="text-xs font-semibold uppercase tracking-[.2em]"
                style={{ color: theme.primaryColor }}
              >
                Olá, eu sou
              </span>
              <h3 className="mt-3 text-4xl font-bold" style={{ color: theme.titleColor }}>
                Seu Nome
              </h3>
              <p className="mt-4 leading-7" style={{ color: theme.textColor }}>
                Uma apresentação profissional personalizada pelo Portfolio CMS.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="px-5 py-3 text-sm font-semibold text-white"
                  style={{
                    background: theme.primaryColor,
                    borderRadius: radius,
                  }}
                >
                  Ver projetos
                </button>
                <button
                  type="button"
                  className="border px-5 py-3 text-sm font-semibold"
                  style={{
                    color: theme.titleColor,
                    borderColor: theme.borderColor,
                    borderRadius: radius,
                  }}
                >
                  Entrar em contato
                </button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Projeto em destaque", "Experiência"].map((title) => (
                  <div
                    key={title}
                    className="border p-4"
                    style={{
                      background: theme.cardColor,
                      borderColor: theme.borderColor,
                      borderRadius: radius,
                    }}
                  >
                    <strong style={{ color: theme.titleColor }}>{title}</strong>
                    <p className="mt-2 text-sm" style={{ color: theme.mutedColor }}>
                      Todo o site seguirá esta identidade.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ThemePage;
