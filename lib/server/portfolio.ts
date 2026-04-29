import { portfolio, type PortfolioProject } from "@/lib/constants/site";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { PortfolioProjectRecord, Profile, SiteSetting } from "@/lib/types/platform";

export type FounderProfile = {
  name: string;
  role: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  highlights: string[];
};

type FounderSettingValue = {
  profile_id?: string;
  headline?: string;
  bio?: string;
  highlights?: string[];
};

const founderPortraitUrl = "/founder-deepak-4k-upscaled.png";
const defaultFounderName = "Deepak Mittal";
const defaultFounderHeadline = "Corporate-grade reliability for local business growth.";
const defaultFounderBio =
  "With 15 years of backend process experience across enterprise operations, I build websites, SEO systems, and AI automations that help small businesses look premium, respond faster, and scale with confidence.";
const defaultFounderHighlights = ["Ex-IBM and Concentrix experience", "AI websites and portals", "Local SEO and automation"];

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function toPublicProject(row: PortfolioProjectRecord): PortfolioProject {
  return {
    title: row.title,
    clientName: row.client_name,
    category: row.category,
    city: row.city || "India",
    liveUrl: row.live_url,
    result: row.result,
    description: row.description,
    tags: readStringArray(row.tags),
    servicesDelivered: readStringArray(row.services_delivered),
    imageUrl: row.image_url,
    featured: row.featured,
  };
}

export async function getPublicPortfolioProjects() {
  const rows = await supabaseRest<PortfolioProjectRecord[]>("/rest/v1/portfolio_projects", {
    service: true,
    query: { active: "eq.true", select: "*", order: "sort_order.asc,created_at.desc" },
  }).catch(() => []);

  if (!rows.length) {
    return portfolio;
  }

  return rows.map(toPublicProject);
}

export async function getFounderProfile() {
  const setting = (
    await supabaseRest<SiteSetting[]>("/rest/v1/site_settings", {
      service: true,
      query: { key: "eq.founder_profile", select: "*" },
    }).catch(() => [])
  )[0];
  const value = (setting?.value || {}) as FounderSettingValue;
  const profiles = await supabaseRest<Profile[]>("/rest/v1/profiles", {
    service: true,
    query: value.profile_id
      ? { id: `eq.${value.profile_id}`, select: "*" }
      : { role: "in.(admin,support)", select: "*", order: "created_at.asc", limit: 1 },
  }).catch(() => []);
  const profile = profiles[0];

  if (!profile) {
    return {
      name: defaultFounderName,
      role: "Founder, Mittal AI Studio",
      headline: value.headline || defaultFounderHeadline,
      bio: value.bio || defaultFounderBio,
      avatarUrl: founderPortraitUrl,
      highlights: value.highlights?.length ? value.highlights : defaultFounderHighlights,
    } satisfies FounderProfile;
  }

  return {
    name: profile.full_name || profile.email,
    role: "Founder, Mittal AI Studio",
    headline: value.headline || defaultFounderHeadline,
    bio: value.bio || defaultFounderBio,
    avatarUrl: founderPortraitUrl,
    highlights: value.highlights?.length ? value.highlights : defaultFounderHighlights,
  } satisfies FounderProfile;
}
