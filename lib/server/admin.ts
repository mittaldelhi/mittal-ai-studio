import { redirect } from "next/navigation";
import { getCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

export const adminTables = [
  "profiles",
  "business_profiles",
  "plans",
  "orders",
  "payments",
  "enquiries",
  "support_threads",
  "support_messages",
  "complaints",
  "reviews",
  "feedback",
  "admin_notes",
  "whatsapp_conversations",
  "analytics_events",
  "portfolio_projects",
  "site_settings",
] as const;

export type AdminTable = (typeof adminTables)[number];

export function isAdminTable(value: string): value is AdminTable {
  return adminTables.includes(value as AdminTable);
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.profile?.role !== "admin" && user.profile?.role !== "support") {
    redirect("/dashboard");
  }

  return user;
}

export async function getAdminRows(table: AdminTable) {
  return supabaseRest<Array<Record<string, unknown>>>(`/rest/v1/${table}`, {
    service: true,
    query: { select: "*", order: "created_at.desc" },
  }).catch(() => []);
}
