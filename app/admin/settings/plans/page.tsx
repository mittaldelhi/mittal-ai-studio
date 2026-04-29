import { PlanManager } from "@/components/portal/PlanManager";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function PlansAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("plans");
  return <PortalShell title="Plans and Pricing" user={user} admin><PlanManager plans={rows} /></PortalShell>;
}
