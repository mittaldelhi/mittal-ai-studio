import { PasswordChangeForm } from "@/components/portal/PasswordChangeForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireCurrentUser } from "@/lib/server/supabase-rest";
import { hasActivePlan } from "@/lib/server/subscription";

export default async function PasswordPage() {
  const user = await requireCurrentUser();
  const isAdmin = user.profile?.role === "admin" || user.profile?.role === "support";
  const hasFullDashboard = isAdmin || (await hasActivePlan(user.id));

  return (
    <PortalShell title="Change Password" user={user} hasActivePlan={hasFullDashboard}>
      <PasswordChangeForm />
      <div className="data-card">
        <h2>Google login users</h2>
        <p>If your account was created only with Google, manage your Google password in your Google account. This form is for email/password accounts.</p>
      </div>
    </PortalShell>
  );
}
