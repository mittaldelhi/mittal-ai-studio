import { FounderSettingsForm } from "@/components/portal/FounderSettingsForm";
import { PortfolioProjectManager } from "@/components/portal/PortfolioProjectManager";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireAdmin } from "@/lib/server/admin";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { PortfolioProjectRecord, Profile, SiteSetting } from "@/lib/types/platform";

type FounderSettings = {
  profile_id?: string;
  headline?: string;
  bio?: string;
  highlights?: string[];
};

export default async function WorkAdminPage() {
  const user = await requireAdmin();
  const [projects, profiles, setting] = await Promise.all([
    supabaseRest<PortfolioProjectRecord[]>("/rest/v1/portfolio_projects", {
      service: true,
      query: { select: "*", order: "sort_order.asc,created_at.desc" },
    }).catch(() => []),
    supabaseRest<Profile[]>("/rest/v1/profiles", {
      service: true,
      query: { select: "*", order: "created_at.asc" },
    }).catch(() => []),
    supabaseRest<SiteSetting[]>("/rest/v1/site_settings", {
      service: true,
      query: { key: "eq.founder_profile", select: "*" },
    }).catch(() => []),
  ]);
  const settings = (setting[0]?.value || {}) as FounderSettings;

  return (
    <PortalShell title="Work and Founder Profile" user={user} admin>
      <div className="data-card">
        <h2>Founder profile</h2>
        <p>Choose the profile photo and copy used in the public founder-led section.</p>
        <FounderSettingsForm profiles={profiles} settings={settings} />
      </div>
      <PortfolioProjectManager projects={projects} />
    </PortalShell>
  );
}
