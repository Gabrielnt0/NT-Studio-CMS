export const EMPTY_SEO_FORM = {
  siteName: "",
  seoTitle: "",
  seoDescription: "",
  keywords: "",
  canonicalUrl: "",
  robots: "index,follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterCard: "summary_large_image",
  faviconUrl: "",
  googleAnalytics: "",
  googleTagManager: "",
  googleSearchConsole: "",
  bingWebmaster: "",
};

function isOptionalUrl(value) {
  return !value.trim() || /^https?:\/\//i.test(value.trim());
}

export function validateSeoForm(formData) {
  if (!formData.siteName.trim()) return "Informe o nome do site.";
  if (!formData.seoTitle.trim()) return "Informe o título SEO.";

  if (formData.seoTitle.trim().length > 70) {
    return "O título SEO deve ter no máximo 70 caracteres.";
  }

  if (formData.seoDescription.trim().length > 170) {
    return "A descrição SEO deve ter no máximo 170 caracteres.";
  }

  const urls = [
    ["URL canônica", formData.canonicalUrl],
    ["Imagem Open Graph", formData.ogImage],
    ["Imagem do Twitter", formData.twitterImage],
    ["Favicon", formData.faviconUrl],
  ];

  const invalidUrl = urls.find(([, value]) => !isOptionalUrl(value));
  if (invalidUrl) {
    return `${invalidUrl[0]} deve começar com http:// ou https://.`;
  }

  if (formData.googleAnalytics.trim() && !/^G-[A-Z0-9]+$/i.test(formData.googleAnalytics.trim())) {
    return "O Measurement ID do Google Analytics deve seguir o formato G-XXXXXXXXXX.";
  }

  if (formData.googleTagManager.trim() && !/^GTM-[A-Z0-9]+$/i.test(formData.googleTagManager.trim())) {
    return "O Container ID do Google Tag Manager deve seguir o formato GTM-XXXXXXX.";
  }

  return null;
}

export function normalizeSeoForm(formData) {
  return Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );
}
