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
  profile,
  update,
  toggle,
  updateProfile,
  toggleProfile,
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
        Abrir edição detalhada
        <ExternalLink size={16} />
      </Link>

      {section.id === "inicio" && (
        <>
          <InspectorGroup title="Conteúdo do Hero">
            <TextInput
              label="Nome"
              value={profile.fullName}
              onChange={(value) => updateProfile("fullName", value)}
            />
            <TextInput
              label="Título profissional"
              value={profile.professionalTitle}
              onChange={(value) => updateProfile("professionalTitle", value)}
            />
            <TextArea
              label="Resumo curto"
              value={profile.shortBio}
              onChange={(value) => updateProfile("shortBio", value)}
              rows={4}
            />
            <TextInput
              label="Localização"
              value={profile.location}
              onChange={(value) => updateProfile("location", value)}
            />
            <TextInput
              label="URL do avatar"
              type="url"
              value={profile.avatarUrl}
              onChange={(value) => updateProfile("avatarUrl", value)}
            />
            <Toggle
              label="Disponível para trabalhos"
              checked={profile.availableForWork}
              onChange={() => toggleProfile("availableForWork")}
            />
          </InspectorGroup>

          <InspectorGroup title="Layout do Hero">
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
        </>
      )}

      {section.id === "sobre" && (
        <InspectorGroup title="Sobre">
          <TextArea
            label="Biografia"
            value={profile.bio}
            onChange={(value) => updateProfile("bio", value)}
            rows={10}
          />
        </InspectorGroup>
      )}

      {section.id === "curriculo" && (
        <InspectorGroup title="Currículo">
          <TextInput
            label="URL do currículo"
            type="url"
            value={profile.resumeUrl}
            onChange={(value) => updateProfile("resumeUrl", value)}
          />
        </InspectorGroup>
      )}

      {section.id === "contato" && (
        <>
          <InspectorGroup title="Contato">
            <TextInput
              label="E-mail"
              type="email"
              value={profile.email}
              onChange={(value) => updateProfile("email", value)}
            />
            <TextInput
              label="Telefone"
              value={profile.phone}
              onChange={(value) => updateProfile("phone", value)}
            />
            <TextInput
              label="GitHub"
              type="url"
              value={profile.githubUrl}
              onChange={(value) => updateProfile("githubUrl", value)}
            />
            <TextInput
              label="LinkedIn"
              type="url"
              value={profile.linkedinUrl}
              onChange={(value) => updateProfile("linkedinUrl", value)}
            />
            <TextInput
              label="Site"
              type="url"
              value={profile.websiteUrl}
              onChange={(value) => updateProfile("websiteUrl", value)}
            />
            <TextInput
              label="Instagram"
              type="url"
              value={profile.instagramUrl}
              onChange={(value) => updateProfile("instagramUrl", value)}
            />
            <TextInput
              label="YouTube"
              type="url"
              value={profile.youtubeUrl}
              onChange={(value) => updateProfile("youtubeUrl", value)}
            />
            <TextInput
              label="Twitter / X"
              type="url"
              value={profile.twitterUrl}
              onChange={(value) => updateProfile("twitterUrl", value)}
            />
          </InspectorGroup>

          <InspectorGroup title="Rodapé">
            <TextInput
              label="Texto do rodapé"
              value={settings.footerText}
              onChange={(value) => update("footerText", value)}
              placeholder="© 2026 Gabriel"
            />
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
        </>
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

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <label className="block text-sm text-zinc-300">
      <span className="mb-2 block">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 5 }) {
  return (
    <label className="block text-sm text-zinc-300">
      <span className="mb-2 block">{label}</span>
      <textarea
        value={value ?? ""}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 leading-6 outline-none focus:border-blue-500"
      />
    </label>
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
