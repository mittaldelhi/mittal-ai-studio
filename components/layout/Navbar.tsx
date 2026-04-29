import { PublicNavClient } from "@/components/layout/PublicNavClient";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/server/supabase-rest";
import { hasActivePlan } from "@/lib/server/subscription";

export async function Navbar() {
  const user = isSupabaseConfigured() ? await getCurrentUser().catch(() => null) : null;
  const isAdmin = user?.profile?.role === "admin" || user?.profile?.role === "support";
  const hasDashboard = user ? isAdmin || (await hasActivePlan(user.id)) : false;

  return <PublicNavClient hasDashboard={hasDashboard} isAdmin={isAdmin} userName={user?.name} />;
}
