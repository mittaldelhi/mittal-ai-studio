import { PortalShell } from "@/components/portal/PortalShell";
import { SmartForm } from "@/components/portal/SmartForm";
import { UpgradeNotice } from "@/components/portal/UpgradeNotice";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import { hasFullDashboardAccess } from "@/lib/server/subscription";
import type { Complaint } from "@/lib/types/platform";

export default async function ComplaintsPage() {
  const user = await requireCurrentUser();
  const hasFullDashboard = await hasFullDashboardAccess(user);

  if (!hasFullDashboard) {
    return (
      <PortalShell title="Complaints" user={user} hasActivePlan={false}>
        <UpgradeNotice />
      </PortalShell>
    );
  }

  const complaints = await supabaseRest<Complaint[]>("/rest/v1/complaints", {
    service: true,
    query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" },
  });

  return (
    <PortalShell title="Complaints" user={user} hasActivePlan>
      <SmartForm endpoint="/api/complaints" submitLabel="Raise Complaint">
        <label>Title<input name="title" required /></label>
        <label>Description<textarea name="description" required /></label>
      </SmartForm>
      <div className="data-card">
        <h2>Your Complaints</h2>
        {complaints.map((complaint) => (
          <p key={complaint.id}>{complaint.title} - {complaint.status} {complaint.admin_response ? `- ${complaint.admin_response}` : ""}</p>
        ))}
      </div>
    </PortalShell>
  );
}
