import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const contentRoutes = {
  inicio: "/profile",
  sobre: "/profile",
  trajetoria: "/experiences",
  formacao: "/education",
  competencias: "/skills",
  projetos: "/portfolio",
  curriculo: "/profile",
  contato: "/profile",
};

export default function SectionInspector({
  section,
  settings,
  update,
  toggle,
}) {
  if (!section) {
    return (
      <p className="text-sm text-zinc-500">
        Selecione uma seção no preview ou na lista.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Propriedades
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">{section.label}</h2>
        <p className="mt-1 text-xs text-zinc-600">#{section.id}</p>
      </div>

      <Link
        to={contentRoutes[section.id] || "/site-builder"}
        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 transition hover:border-blue-500/40 hover:text-white"
      >
        Editar conteúdo detalhado
        <ExternalLink size={16} />
      </Link>

      {section.id === "inicio" && (
        <InspectorGroup title="Hero">
          <Select
            label="Layout"
            value={settings.heroLayout}
            onChange={(value) => update("heroLayout", value)}
            options={[
              ["split", "Dividido"],
              ["centered", "Centralizado"],
              ["fullscreen", "Tela cheia"],
            ]}
          />
          <Toggle
            label="Mostrar avatar"
            checked={settings.showHeroAvatar}
            onChange={() => toggle("showHeroAvatar")}
          />
          <Toggle
            label="Botão de currículo"
            checked={settings.showResumeButton}
            onChange={() => toggle("showResumeButton")}
          />
          <Toggle
            label="Botão de contato"
            checked={settings.showContactButton}
            onChange={() => toggle("showContactButton")}
          />
          <Toggle
            label="Redes sociais"
            checked={settings.showSocialLinks}
            onChange={() => toggle("showSocialLinks")}
          />
        </InspectorGroup>
      )}

      {section.id === "projetos" && (
        <InspectorGroup title="Projetos">
          <Select
            label="Colunas"
            value={String(settings.projectsColumns)}
            onChange={(value) => update("projectsColumns", Number(value))}
            options={[
              ["2", "2 colunas"],
              ["3", "3 colunas"],
              ["4", "4 colunas"],
            ]}
          />
          <NumberInput
            label="Projetos por página"
            value={settings.projectsPerPage}
            min={1}
            max={24}
            onChange={(value) => update("projectsPerPage", value)}
          />
          <Toggle
            label="Mostrar filtros"
            checked={settings.showProjectFilters}
            onChange={() => toggle("showProjectFilters")}
          />
          <Toggle
            label="Mostrar tecnologias"
            checked={settings.showProjectTechnologies}
            onChange={() => toggle("showProjectTechnologies")}
          />
          <Toggle
            label="Mostrar cliente"
            checked={settings.showProjectClient}
            onChange={() => toggle("showProjectClient")}
          />
          <Toggle
            label="Mostrar data"
            checked={settings.showProjectDate}
            onChange={() => toggle("showProjectDate")}
          />
        </InspectorGroup>
      )}

      {section.id === "competencias" && (
        <InspectorGroup title="Habilidades">
          <Select
            label="Layout"
            value={settings.skillsLayout}
            onChange={(value) => update("skillsLayout", value)}
            options={[
              ["cards", "Cards"],
              ["bars", "Barras"],
              ["list", "Lista"],
            ]}
          />
          <Toggle
            label="Agrupar por categoria"
            checked={settings.groupSkillsByCategory}
            onChange={() => toggle("groupSkillsByCategory")}
          />
        </InspectorGroup>
      )}

      {section.id === "contato" && (
        <InspectorGroup title="Rodapé">
          <Toggle
            label="Exibir redes no rodapé"
            checked={settings.showFooterSocialLinks}
            onChange={() => toggle("showFooterSocialLinks")}
          />
          <Toggle
            label="Botão voltar ao topo"
            checked={settings.showBackToTop}
            onChange={() => toggle("showBackToTop")}
          />
        </InspectorGroup>
      )}

      <InspectorGroup title="Layout geral">
        <Select
          label="Alinhamento"
          value={settings.contentAlignment}
          onChange={(value) => update("contentAlignment", value)}
          options={[
            ["left", "À esquerda"],
            ["center", "Centralizado"],
          ]}
        />
        <Select
          label="Espaçamento"
          value={settings.sectionSpacing}
          onChange={(value) => update("sectionSpacing", value)}
          options={[
            ["compact", "Compacto"],
            ["comfortable", "Confortável"],
            ["spacious", "Espaçoso"],
          ]}
        />
        <Select
          label="Largura do conteúdo"
          value={settings.containerWidth}
          onChange={(value) => update("containerWidth", value)}
          options={[
            ["compact", "Compacta"],
            ["wide", "Ampla"],
            ["full", "Máxima"],
          ]}
        />
      </InspectorGroup>
    </div>
  );
}

function InspectorGroup({ title, children }) {
  return (
    <section className="space-y-3 border-t border-zinc-800 pt-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
        {title}
      </p>
      {children}
    </section>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm text-zinc-300">
      <span className="mb-2 block">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
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

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
      <span className="text-sm text-zinc-300">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

function NumberInput({ label, value, min, max, onChange }) {
  return (
    <label className="block text-sm text-zinc-300">
      <span className="mb-2 block">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}
