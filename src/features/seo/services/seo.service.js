import { supabase } from "../../../services/supabase";

const SEO_COLUMNS = `
  id,
  user_id,
  site_name,
  seo_title,
  seo_description,
  keywords,
  canonical_url,
  robots,
  og_title,
  og_description,
  og_image,
  twitter_title,
  twitter_description,
  twitter_image,
  twitter_card,
  favicon_url,
  google_analytics,
  google_tag_manager,
  google_search_console,
  bing_webmaster,
  created_at,
  updated_at
`;

function mapSeoFromDatabase(item) {
  return {
    id: item?.id ?? null,
    userId: item?.user_id ?? null,
    siteName: item?.site_name ?? "",
    seoTitle: item?.seo_title ?? "",
    seoDescription: item?.seo_description ?? "",
    keywords: item?.keywords ?? "",
    canonicalUrl: item?.canonical_url ?? "",
    robots: item?.robots ?? "index,follow",
    ogTitle: item?.og_title ?? "",
    ogDescription: item?.og_description ?? "",
    ogImage: item?.og_image ?? "",
    twitterTitle: item?.twitter_title ?? "",
    twitterDescription: item?.twitter_description ?? "",
    twitterImage: item?.twitter_image ?? "",
    twitterCard: item?.twitter_card ?? "summary_large_image",
    faviconUrl: item?.favicon_url ?? "",
    googleAnalytics: item?.google_analytics ?? "",
    googleTagManager: item?.google_tag_manager ?? "",
    googleSearchConsole: item?.google_search_console ?? "",
    bingWebmaster: item?.bing_webmaster ?? "",
    createdAt: item?.created_at ?? null,
    updatedAt: item?.updated_at ?? null,
  };
}

function mapSeoToDatabase(item) {
  return {
    site_name: item.siteName.trim() || null,
    seo_title: item.seoTitle.trim() || null,
    seo_description: item.seoDescription.trim() || null,
    keywords: item.keywords.trim() || null,
    canonical_url: item.canonicalUrl.trim() || null,
    robots: item.robots.trim() || "index,follow",
    og_title: item.ogTitle.trim() || null,
    og_description: item.ogDescription.trim() || null,
    og_image: item.ogImage.trim() || null,
    twitter_title: item.twitterTitle.trim() || null,
    twitter_description: item.twitterDescription.trim() || null,
    twitter_image: item.twitterImage.trim() || null,
    twitter_card: item.twitterCard || "summary_large_image",
    favicon_url: item.faviconUrl.trim() || null,
    google_analytics: item.googleAnalytics.trim() || null,
    google_tag_manager: item.googleTagManager.trim() || null,
    google_search_console: item.googleSearchConsole.trim() || null,
    bing_webmaster: item.bingWebmaster.trim() || null,
  };
}

export async function getSeoSettings() {
  const { data, error } = await supabase
    .from("seo")
    .select(SEO_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return mapSeoFromDatabase(data);
}

export async function saveSeoSettings(item) {
  const payload = mapSeoToDatabase(item);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const userId = userData?.user?.id;
  if (!userId) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("seo")
    .upsert(
      { ...payload, user_id: userId },
      { onConflict: "user_id" },
    )
    .select(SEO_COLUMNS)
    .single();

  if (error) throw error;
  return mapSeoFromDatabase(data);
}
