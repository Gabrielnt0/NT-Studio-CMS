import Save from "lucide-react/dist/esm/icons/save";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ContentErrorState,
  ContentLoadingState,
  ContentPageHeader,
} from "../../../components/content";
import FormTextarea from "../../../components/form/FormTextarea";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useSeo } from "../hooks/useSeo";
import {
  EMPTY_SEO_FORM,
  normalizeSeoForm,
  validateSeoForm,
} from "../validation/seo.validation";

const tabs = [
  ["general", "Geral"],
  ["social", "Redes sociais"],
  ["integrations", "Integrações"],
];

const selectClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

export default function SeoPage() {
  const {
    seoSettings,
    isLoading,
    isSaving,
    error,
    reloadSeo,
    saveSeoSettings,
  } = useSeo();

  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(EMPTY_SEO_FORM);

  useEffect(() => {
    setFormData({ ...EMPTY_SEO_FORM, ...seoSettings });
  }, [seoSettings]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = validateSeoForm(formData);
    if (message) return toast.error(message);

    try {
      await saveSeoSettings(normalizeSeoForm(formData));
      toast.success("Configurações de SEO salvas com sucesso.");
    } catch (requestError) {
      console.error("Erro ao salvar SEO:", requestError);
      toast.error(requestError?.message || "Não foi possível salvar o SEO.");
    }
  }

  if (isLoading) {
    return <ContentLoadingState message="Carregando configurações de SEO..." />;
  }

  if (error) {
    return (
      <ContentErrorState
        title="Não foi possível carregar o SEO"
        onRetry={reloadSeo}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContentPageHeader
        title="SEO"
        description="Gerencie metadados, compartilhamento social e integrações do seu portfólio."
        action={
          <Button type="submit" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? "Salvando..." : "Salvar configurações"}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-2">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === value
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <section className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2">
          <Input label="Nome do site" name="siteName" value={formData.siteName} onChange={handleChange} placeholder="Gabriel Andrade" required />
          <Input label="Título SEO" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Gabriel Andrade | Portfólio" required />
          <div className="md:col-span-2">
            <FormTextarea label="Descrição SEO" name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={4} resize={false} placeholder="Descrição que aparecerá nos mecanismos de busca." />
            <p className="mt-2 text-xs text-zinc-500">{formData.seoDescription.length}/170 caracteres</p>
          </div>
          <div className="md:col-span-2">
            <FormTextarea label="Palavras-chave" name="keywords" value={formData.keywords} onChange={handleChange} rows={3} resize={false} placeholder="portfolio, desenvolvedor, vídeo, conteúdo digital" />
          </div>
          <Input label="URL canônica" name="canonicalUrl" type="url" value={formData.canonicalUrl} onChange={handleChange} placeholder="https://seusite.com/" />
          <Input label="Favicon" name="faviconUrl" type="url" value={formData.faviconUrl} onChange={handleChange} placeholder="https://.../favicon.png" />
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Robots</label>
            <select name="robots" value={formData.robots} onChange={handleChange} className={selectClass}>
              <option value="index,follow">index,follow</option>
              <option value="index,nofollow">index,nofollow</option>
              <option value="noindex,follow">noindex,follow</option>
              <option value="noindex,nofollow">noindex,nofollow</option>
            </select>
          </div>
        </section>
      )}

      {activeTab === "social" && (
        <section className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2">
          <Input label="Título Open Graph" name="ogTitle" value={formData.ogTitle} onChange={handleChange} />
          <Input label="Imagem Open Graph" name="ogImage" type="url" value={formData.ogImage} onChange={handleChange} placeholder="https://.../preview.png" />
          <div className="md:col-span-2">
            <FormTextarea label="Descrição Open Graph" name="ogDescription" value={formData.ogDescription} onChange={handleChange} rows={4} resize={false} />
          </div>
          <Input label="Título do Twitter" name="twitterTitle" value={formData.twitterTitle} onChange={handleChange} />
          <Input label="Imagem do Twitter" name="twitterImage" type="url" value={formData.twitterImage} onChange={handleChange} placeholder="https://.../preview.png" />
          <div className="md:col-span-2">
            <FormTextarea label="Descrição do Twitter" name="twitterDescription" value={formData.twitterDescription} onChange={handleChange} rows={4} resize={false} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Tipo de Twitter Card</label>
            <select name="twitterCard" value={formData.twitterCard} onChange={handleChange} className={selectClass}>
              <option value="summary_large_image">summary_large_image</option>
              <option value="summary">summary</option>
            </select>
          </div>
        </section>
      )}

      {activeTab === "integrations" && (
        <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <h2 className="font-semibold text-white">Códigos aplicados ao site público</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Os valores abaixo são carregados automaticamente pelo portfólio. O Property ID usado para consultar métricas continua em Configurações.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Google Analytics — Measurement ID" name="googleAnalytics" value={formData.googleAnalytics} onChange={handleChange} placeholder="G-XXXXXXXXXX" />
            <Input label="Google Tag Manager — Container ID" name="googleTagManager" value={formData.googleTagManager} onChange={handleChange} placeholder="GTM-XXXXXXX" />
            <Input label="Google Search Console — verificação" name="googleSearchConsole" value={formData.googleSearchConsole} onChange={handleChange} placeholder="Código de verificação" />
            <Input label="Bing Webmaster Tools — verificação" name="bingWebmaster" value={formData.bingWebmaster} onChange={handleChange} placeholder="Código de verificação" />
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          <Save size={18} />
          {isSaving ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>
    </form>
  );
}
