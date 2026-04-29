import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/server/supabase-rest";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireCurrentUser();
  } catch {
    redirect("/login");
  }

  return children;
}
