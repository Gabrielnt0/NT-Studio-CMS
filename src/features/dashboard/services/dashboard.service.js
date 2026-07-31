import { getAnalyticsOverview } from "../../analytics/services/analytics.service";
import { listMedia } from "../../media/services/media.service";
import { getProjects } from "../../portfolio/services/portfolioProjects.service";
import { getProfile } from "../../profile/services/profile.service";
import { getSkillItems } from "../../skills/services/skills.service";

const NUMBER_FORMATTER = new Intl.NumberFormat("pt-BR");
const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function toTimestamp(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function formatRelativeDate(value) {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return "Sem data";
  }

  const differenceMinutes = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 60_000),
  );

  if (differenceMinutes < 1) return "Agora";
  if (differenceMinutes < 60) return `Há ${differenceMinutes} min`;

  const differenceHours = Math.floor(differenceMinutes / 60);

  if (differenceHours < 24) {
    return differenceHours === 1 ? "Há 1 hora" : `Há ${differenceHours} horas`;
  }

  const differenceDays = Math.floor(differenceHours / 24);

  if (differenceDays === 1) return "Ontem";
  if (differenceDays < 7) return `Há ${differenceDays} dias`;

  return DATE_FORMATTER.format(new Date(timestamp));
}

function normalizeStatus(status) {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (["published", "publicado", "active", "ativo"].includes(normalized)) {
    return { label: "Publicado", variant: "green" };
  }

  if (
    [
      "in_progress",
      "in-progress",
      "development",
      "developing",
      "em desenvolvimento",
      "em andamento",
    ].includes(normalized)
  ) {
    return { label: "Em desenvolvimento", variant: "blue" };
  }

  if (["planned", "planning", "planejamento"].includes(normalized)) {
    return { label: "Planejamento", variant: "yellow" };
  }

  if (["draft", "rascunho"].includes(normalized)) {
    return { label: "Rascunho", variant: "gray" };
  }

  if (["archived", "arquivado"].includes(normalized)) {
    return { label: "Arquivado", variant: "red" };
  }

  return {
    label: status ? String(status) : "Sem status",
    variant: "gray",
  };
}

function mapRecentProject(project) {
  const normalizedStatus = normalizeStatus(project.status);
  const updatedAtIso = project.updatedAtIso ?? project.createdAtIso ?? null;

  return {
    id: project.id,
    title: project.title || "Projeto sem título",
    category: project.category || "Projeto",
    status: normalizedStatus.label,
    statusVariant: normalizedStatus.variant,
    updatedAt: formatRelativeDate(updatedAtIso),
    timestamp: toTimestamp(updatedAtIso),
  };
}

function createActivities({ projects, media, profile }) {
  const activities = [
    ...projects.slice(0, 2).map((project) => {
      const timestamp =
        toTimestamp(project.updatedAtIso) ?? toTimestamp(project.createdAtIso);

      return {
        id: `project-${project.id}`,
        type: "project",
        title: "Projeto atualizado",
        description: project.title || "Projeto sem título",
        time: formatRelativeDate(timestamp),
        timestamp,
      };
    }),

    ...media.slice(0, 2).map((item) => {
      const timestamp =
        toTimestamp(item.updatedAt) ?? toTimestamp(item.createdAt);

      return {
        id: `media-${item.id}`,
        type: "media",
        title: "Arquivo adicionado",
        description: item.name || item.fileName || "Arquivo da biblioteca",
        time: formatRelativeDate(timestamp),
        timestamp,
      };
    }),
  ];

  if (profile) {
    const timestamp =
      toTimestamp(profile.updatedAt) ?? toTimestamp(profile.createdAt);

    activities.push({
      id: `profile-${profile.id}`,
      type: "profile",
      title: "Perfil atualizado",
      description: "As informações profissionais foram alteradas.",
      time: formatRelativeDate(timestamp),
      timestamp,
    });
  }

  return activities
    .filter((activity) => activity.timestamp !== null)
    .sort((first, second) => second.timestamp - first.timestamp)
    .slice(0, 3);
}

function getViews(metrics) {
  return Number(
    metrics?.screenPageViews ??
      metrics?.views ??
      metrics?.pageViews ??
      metrics?.activeUsers ??
      0,
  );
}

export async function getDashboardOverview() {
  const [
    projectsResult,
    skillsResult,
    mediaResult,
    analyticsResult,
    profileResult,
  ] = await Promise.allSettled([
    getProjects(),
    getSkillItems(),
    listMedia(),
    getAnalyticsOverview({ periodDays: 30 }),
    getProfile(),
  ]);

  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const skills =
    skillsResult.status === "fulfilled" ? skillsResult.value : [];
  const media =
    mediaResult.status === "fulfilled" ? mediaResult.value : [];
  const analytics =
    analyticsResult.status === "fulfilled" ? analyticsResult.value : null;
  const profile =
    profileResult.status === "fulfilled" ? profileResult.value : null;

  const failedSources = [
    ["projects", projectsResult],
    ["skills", skillsResult],
    ["media", mediaResult],
    ["analytics", analyticsResult],
    ["profile", profileResult],
  ]
    .filter(([, result]) => result.status === "rejected")
    .map(([source, result]) => ({
      source,
      message: result.reason?.message ?? "Falha desconhecida.",
    }));

  const views = getViews(analytics?.metrics);
  const recentProjects = projects.slice(0, 5).map(mapRecentProject);

  return {
    ownerName:
      profile?.fullName?.trim() ||
      profile?.email?.split("@")[0] ||
      "Administrador",

    statistics: {
      projects: projects.length,
      skills: skills.length,
      views,
      media: media.length,
    },

    formattedViews: NUMBER_FORMATTER.format(views),
    recentProjects,
    recentActivities: createActivities({ projects, media, profile }),
    failedSources,
    hasPartialFailure: failedSources.length > 0,
  };
}
