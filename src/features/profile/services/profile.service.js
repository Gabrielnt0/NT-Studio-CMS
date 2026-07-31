import { supabase } from "../../../services/supabase";

const PROFILE_COLUMNS = `
  id,
  user_id,
  full_name,
  professional_title,
  short_bio,
  bio,
  location,
  email,
  phone,
  github_url,
  linkedin_url,
  website_url,
  resume_url,
  avatar_url,
  available_for_work,
  created_at,
  updated_at
`;

function mapProfileFromDatabase(profile) {
  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.user_id,
    fullName: profile.full_name ?? "",
    professionalTitle: profile.professional_title ?? "",
    shortBio: profile.short_bio ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    githubUrl: profile.github_url ?? "",
    linkedinUrl: profile.linkedin_url ?? "",
    websiteUrl: profile.website_url ?? "",
    resumeUrl: profile.resume_url ?? "",
    avatarUrl: profile.avatar_url ?? "",
    availableForWork: Boolean(profile.available_for_work),
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

function mapProfileToDatabase(profile) {
  return {
    full_name: profile.fullName.trim(),
    professional_title: profile.professionalTitle.trim(),
    short_bio: profile.shortBio.trim() || null,
    bio: profile.bio.trim() || null,
    location: profile.location.trim() || null,
    email: profile.email.trim() || null,
    phone: profile.phone.trim() || null,
    github_url: profile.githubUrl.trim() || null,
    linkedin_url: profile.linkedinUrl.trim() || null,
    website_url: profile.websiteUrl.trim() || null,
    resume_url: profile.resumeUrl.trim() || null,
    avatar_url: profile.avatarUrl.trim() || null,
    available_for_work: Boolean(profile.availableForWork),
  };
}

export async function getProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return mapProfileFromDatabase(data);
}

export async function upsertProfile(profile) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const payload = {
    user_id: user.id,
    ...mapProfileToDatabase(profile),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select(PROFILE_COLUMNS)
    .single();

  if (error) throw error;

  return mapProfileFromDatabase(data);
}
