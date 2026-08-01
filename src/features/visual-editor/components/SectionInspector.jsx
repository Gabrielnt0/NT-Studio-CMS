import { ExternalLink, Image, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MediaPickerModal from "./MediaPickerModal";

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

const DEFAULT_SECTION_STYLE = {
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
};

export default function SectionInspector({
  section,
  settings,
  profile,
  theme,
  media,
  update,
  toggle,
  updateProfile,
  toggleProfile,
  updateTheme,
  updateSectionStyle,
  resetSectionStyle,
}) {
  const [mediaTarget, setMediaTarget] = useState(null);

  if (!section) {
    return <p className="text-sm text-zinc-500">Selecione uma seção no preview ou na lista.</p>;
  }

  const sectionStyle = {
    ...DEFAULT_SECTION_STYLE,
    ...(theme.settings?.sectionStyles?.[section.id] || {}),
  };

  function chooseMedia(item) {
    if (mediaTarget === "avatar") updateProfile("avatarUrl", item.publicUrl);
    if (mediaTarget === "background") {
      updateSectionStyle(section.id, "backgroundImage", item.publicUrl);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Propriedades</p>
        <h2 className="mt-2 text-xl font-semibold text-white">{section.label}</h2>
        <p className="mt-1 text-xs text-zinc-600">#{section.id}</p>
      </div>

      <Link to={contentRoutes[section.id] || "/site-builder"} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 transition hover:border-blue-500/40 hover:text-white">
        Abrir edição detalhada <ExternalLink size={16} />
      </Link>

      {section.id === "inicio" && (
        <>
          <InspectorGroup title="Conteúdo do Hero">
            <TextInput label="Nome" value={profile.fullName} onChange={(value) => updateProfile("fullName", value)} />
            <TextInput label="Título profissional" value={profile.professionalTitle} onChange={(value) => updateProfile("professionalTitle", value)} />
            <TextArea label="Resumo curto" value={profile.shortBio} onChange={(value) => updateProfile("shortBio", value)} rows={4} />
            <TextInput label="Localização" value={profile.location} onChange={(value) => updateProfile("location", value)} />
            <ImageField label="Avatar" value={profile.avatarUrl} onChange={(value) => updateProfile("avatarUrl", value)} onChoose={() => setMediaTarget("avatar")} />
            <Toggle label="Disponível para trabalhos" checked={profile.availableForWork} onChange={() => toggleProfile("availableForWork")} />
          </InspectorGroup>
          <InspectorGroup title="Layout do Hero">
            <Select label="Layout" value={settings.heroLayout} onChange={(value) => update("heroLayout", value)} options={[["split","Dividido"],["centered","Centralizado"],["fullscreen","Tela cheia"]]} />
            <Toggle label="Mostrar avatar" checked={settings.showHeroAvatar} onChange={() => toggle("showHeroAvatar")} />
            <Toggle label="Botão de currículo" checked={settings.showResumeButton} onChange={() => toggle("showResumeButton")} />
            <Toggle label="Botão de contato" checked={settings.showContactButton} onChange={() => toggle("showContactButton")} />
            <Toggle label="Redes sociais" checked={settings.showSocialLinks} onChange={() => toggle("showSocialLinks")} />
          </InspectorGroup>
        </>
      )}

      {section.id === "sobre" && <InspectorGroup title="Sobre"><TextArea label="Biografia" value={profile.bio} onChange={(value) => updateProfile("bio", value)} rows={10} /></InspectorGroup>}

      {section.id === "curriculo" && <InspectorGroup title="Currículo"><TextInput label="URL do currículo" type="url" value={profile.resumeUrl} onChange={(value) => updateProfile("resumeUrl", value)} /></InspectorGroup>}

      {section.id === "contato" && (
        <>
          <InspectorGroup title="Contato">
            <TextInput label="E-mail" type="email" value={profile.email} onChange={(value) => updateProfile("email", value)} />
            <TextInput label="Telefone" value={profile.phone} onChange={(value) => updateProfile("phone", value)} />
            <TextInput label="GitHub" type="url" value={profile.githubUrl} onChange={(value) => updateProfile("githubUrl", value)} />
            <TextInput label="LinkedIn" type="url" value={profile.linkedinUrl} onChange={(value) => updateProfile("linkedinUrl", value)} />
            <TextInput label="Site" type="url" value={profile.websiteUrl} onChange={(value) => updateProfile("websiteUrl", value)} />
            <TextInput label="Instagram" type="url" value={profile.instagramUrl} onChange={(value) => updateProfile("instagramUrl", value)} />
            <TextInput label="YouTube" type="url" value={profile.youtubeUrl} onChange={(value) => updateProfile("youtubeUrl", value)} />
            <TextInput label="Twitter / X" type="url" value={profile.twitterUrl} onChange={(value) => updateProfile("twitterUrl", value)} />
          </InspectorGroup>
          <InspectorGroup title="Rodapé">
            <TextInput label="Texto do rodapé" value={settings.footerText} onChange={(value) => update("footerText", value)} placeholder="© 2026 Gabriel" />
            <Toggle label="Exibir redes no rodapé" checked={settings.showFooterSocialLinks} onChange={() => toggle("showFooterSocialLinks")} />
            <Toggle label="Botão voltar ao topo" checked={settings.showBackToTop} onChange={() => toggle("showBackToTop")} />
          </InspectorGroup>
        </>
      )}

      {section.id === "projetos" && (
        <InspectorGroup title="Projetos">
          <Select label="Colunas" value={String(settings.projectsColumns)} onChange={(value) => update("projectsColumns", Number(value))} options={[["2","2 colunas"],["3","3 colunas"],["4","4 colunas"]]} />
          <NumberInput label="Projetos por página" value={settings.projectsPerPage} min={1} max={24} onChange={(value) => update("projectsPerPage", value)} />
          <Toggle label="Mostrar filtros" checked={settings.showProjectFilters} onChange={() => toggle("showProjectFilters")} />
          <Toggle label="Mostrar tecnologias" checked={settings.showProjectTechnologies} onChange={() => toggle("showProjectTechnologies")} />
          <Toggle label="Mostrar cliente" checked={settings.showProjectClient} onChange={() => toggle("showProjectClient")} />
          <Toggle label="Mostrar data" checked={settings.showProjectDate} onChange={() => toggle("showProjectDate")} />
        </InspectorGroup>
      )}

      {section.id === "competencias" && (
        <InspectorGroup title="Habilidades">
          <Select label="Layout" value={settings.skillsLayout} onChange={(value) => update("skillsLayout", value)} options={[["cards","Cards"],["bars","Barras"],["list","Lista"]]} />
          <Toggle label="Agrupar por categoria" checked={settings.groupSkillsByCategory} onChange={() => toggle("groupSkillsByCategory")} />
        </InspectorGroup>
      )}

      <InspectorGroup title="Aparência global">
        <ColorInput label="Cor principal" value={theme.primaryColor} onChange={(value) => updateTheme("primaryColor", value)} />
        <ColorInput label="Fundo do site" value={theme.backgroundColor} onChange={(value) => updateTheme("backgroundColor", value)} />
        <ColorInput label="Superfície" value={theme.surfaceColor} onChange={(value) => updateTheme("surfaceColor", value)} />
        <ColorInput label="Cards" value={theme.cardColor} onChange={(value) => updateTheme("cardColor", value)} />
        <ColorInput label="Títulos" value={theme.titleColor} onChange={(value) => updateTheme("titleColor", value)} />
        <ColorInput label="Texto" value={theme.textColor} onChange={(value) => updateTheme("textColor", value)} />
        <Select label="Fonte" value={theme.fontFamily} onChange={(value) => updateTheme("fontFamily", value)} options={[["Inter","Inter"],["Manrope","Manrope"],["Poppins","Poppins"],["Space Grotesk","Space Grotesk"],["Georgia","Georgia"]]} />
        <Select label="Arredondamento" value={theme.borderRadius} onChange={(value) => updateTheme("borderRadius", value)} options={[["square","Discreto"],["rounded","Arredondado"],["pill","Muito arredondado"]]} />
        <Select label="Sombras" value={theme.shadowStyle} onChange={(value) => updateTheme("shadowStyle", value)} options={[["none","Sem sombras"],["soft","Suaves"],["medium","Médias"]]} />
        <Toggle label="Animações" checked={theme.motionEnabled} onChange={() => updateTheme("motionEnabled", !theme.motionEnabled)} />
      </InspectorGroup>

      <InspectorGroup title={`Aparência da seção ${section.label}`}>
        <ColorInput label="Fundo" value={sectionStyle.backgroundColor} onChange={(value) => updateSectionStyle(section.id, "backgroundColor", value)} allowEmpty />
        <ColorInput label="Texto" value={sectionStyle.textColor} onChange={(value) => updateSectionStyle(section.id, "textColor", value)} allowEmpty />
        <ImageField label="Imagem de fundo" value={sectionStyle.backgroundImage} onChange={(value) => updateSectionStyle(section.id, "backgroundImage", value)} onChoose={() => setMediaTarget("background")} />
        <RangeInput label="Escurecimento da imagem" value={sectionStyle.backgroundOverlay} min={0} max={90} suffix="%" onChange={(value) => updateSectionStyle(section.id, "backgroundOverlay", value)} />
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Padding superior" value={sectionStyle.paddingTop} min={0} max={240} onChange={(value) => updateSectionStyle(section.id, "paddingTop", value)} />
          <NumberInput label="Padding inferior" value={sectionStyle.paddingBottom} min={0} max={240} onChange={(value) => updateSectionStyle(section.id, "paddingBottom", value)} />
          <NumberInput label="Margem superior" value={sectionStyle.marginTop} min={0} max={240} onChange={(value) => updateSectionStyle(section.id, "marginTop", value)} />
          <NumberInput label="Margem inferior" value={sectionStyle.marginBottom} min={0} max={240} onChange={(value) => updateSectionStyle(section.id, "marginBottom", value)} />
        </div>
        <ColorInput label="Cor da borda" value={sectionStyle.borderColor} onChange={(value) => updateSectionStyle(section.id, "borderColor", value)} allowEmpty />
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Borda" value={sectionStyle.borderWidth} min={0} max={12} onChange={(value) => updateSectionStyle(section.id, "borderWidth", value)} />
          <NumberInput label="Raio" value={sectionStyle.borderRadius} min={0} max={80} onChange={(value) => updateSectionStyle(section.id, "borderRadius", value)} />
        </div>
        <button type="button" onClick={() => resetSectionStyle(section.id)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400 transition hover:border-red-500/30 hover:text-red-400">
          <RotateCcw size={16} /> Restaurar aparência da seção
        </button>
      </InspectorGroup>

      <InspectorGroup title="Layout geral">
        <Select label="Alinhamento" value={settings.contentAlignment} onChange={(value) => update("contentAlignment", value)} options={[["left","À esquerda"],["center","Centralizado"]]} />
        <Select label="Espaçamento" value={settings.sectionSpacing} onChange={(value) => update("sectionSpacing", value)} options={[["compact","Compacto"],["comfortable","Confortável"],["spacious","Espaçoso"]]} />
        <Select label="Largura do conteúdo" value={settings.containerWidth} onChange={(value) => update("containerWidth", value)} options={[["compact","Compacta"],["wide","Ampla"],["full","Máxima"]]} />
      </InspectorGroup>

      <MediaPickerModal isOpen={Boolean(mediaTarget)} media={media} title={mediaTarget === "avatar" ? "Selecionar avatar" : "Selecionar imagem de fundo"} onClose={() => setMediaTarget(null)} onSelect={chooseMedia} />
    </div>
  );
}

function InspectorGroup({ title, children }) { return <section className="space-y-3 border-t border-zinc-800 pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{title}</p>{children}</section>; }
function TextInput({ label, value, onChange, type="text", placeholder="" }) { return <label className="block text-sm text-zinc-300"><span className="mb-2 block">{label}</span><input type={type} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500" /></label>; }
function TextArea({ label, value, onChange, rows=5 }) { return <label className="block text-sm text-zinc-300"><span className="mb-2 block">{label}</span><textarea value={value ?? ""} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 leading-6 outline-none focus:border-blue-500" /></label>; }
function Select({ label, value, onChange, options }) { return <label className="block text-sm text-zinc-300"><span className="mb-2 block">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 outline-none focus:border-blue-500">{options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>; }
function Toggle({ label, checked, onChange }) { return <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"><span className="text-sm text-zinc-300">{label}</span><input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500" /></label>; }
function NumberInput({ label, value, min, max, onChange }) { return <label className="block text-xs text-zinc-400"><span className="mb-2 block">{label}</span><input type="number" value={value ?? 0} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-200 outline-none focus:border-blue-500" /></label>; }
function RangeInput({ label, value, min, max, suffix, onChange }) { return <label className="block text-sm text-zinc-300"><span className="mb-2 flex justify-between"><span>{label}</span><span className="text-zinc-500">{value}{suffix}</span></span><input type="range" value={value ?? 0} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} className="w-full" /></label>; }
function ColorInput({ label, value, onChange, allowEmpty=false }) { const safe=value || "#000000"; return <label className="block text-sm text-zinc-300"><span className="mb-2 block">{label}</span><div className="flex gap-2"><input type="color" value={safe} onChange={(event) => onChange(event.target.value)} className="h-11 w-12 rounded-lg border border-zinc-800 bg-zinc-950 p-1"/><input value={value ?? ""} placeholder={allowEmpty ? "Padrão" : "#000000"} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm outline-none focus:border-blue-500"/>{allowEmpty && value && <button type="button" onClick={() => onChange("")} className="rounded-lg border border-zinc-800 px-2 text-xs text-zinc-500">Limpar</button>}</div></label>; }
function ImageField({ label, value, onChange, onChoose }) { return <div className="space-y-2"><span className="block text-sm text-zinc-300">{label}</span>{value && <img src={value} alt="Prévia" className="h-28 w-full rounded-xl border border-zinc-800 object-cover"/>}<div className="flex gap-2"><input type="url" value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder="https://..." className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none focus:border-blue-500"/><button type="button" onClick={onChoose} className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-zinc-300 transition hover:border-blue-500"><Image size={17}/></button></div></div>; }
