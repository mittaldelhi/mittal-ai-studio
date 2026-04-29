import { supabaseRest } from "@/lib/server/supabase-rest";
import type { SessionUser } from "@/lib/server/supabase-rest";
import type { Payment } from "@/lib/types/platform";

export async function getActivePayment(userId: string) {
  const rows = await supabaseRest<Payment[]>("/rest/v1/payments", {
    service: true,
    query: {
      user_id: `eq.${userId}`,
      status: "eq.paid",
      select: "*",
      order: "created_at.desc",
      limit: 1,
    },
  }).catch(() => []);

  return rows[0] || null;
}

export async function hasActivePlan(userId: string) {
  return Boolean(await getActivePayment(userId));
}

export async function hasFullDashboardAccess(user: SessionUser) {
  return user.profile?.role === "admin" || user.profile?.role === "support" || (await hasActivePlan(user.id));
}
