import { PortalShell } from "@/components/portal/PortalShell";
import { ProfileForm } from "@/components/portal/ProfileForm";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import type { BusinessProfile } from "@/lib/types/platform";

export default async function ProfilePage() {
  const user = await requireCurrentUser();
  const business = (
    await supabaseRest<BusinessProfile[]>("/rest/v1/business_profiles", {
      service: true,
      query: { user_id: `eq.${user.id}`, select: "*" },
    })
  )[0];

  return (
    <PortalShell title="Profile and Business Details" user={user}>
      <ProfileForm email={user.email} profile={user.profile} business={business || null} />
    </PortalShell>
  );
}
