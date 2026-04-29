import { PortalShell } from "@/components/portal/PortalShell";
import { SmartForm } from "@/components/portal/SmartForm";
import { UpgradeNotice } from "@/components/portal/UpgradeNotice";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import { hasFullDashboardAccess } from "@/lib/server/subscription";
import type { Feedback } from "@/lib/types/platform";

export default async function FeedbackPage() {
  const user = await requireCurrentUser();
  const hasFullDashboard = await hasFullDashboardAccess(user);

  if (!hasFullDashboard) {
    return (
      <PortalShell title="Feedback" user={user} hasActivePlan={false}>
        <UpgradeNotice />
      </PortalShell>
    );
  }

  const feedback = await supabaseRest<Feedback[]>("/rest/v1/feedback", {
    service: true,
    query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" },
  });

  return (
    <PortalShell title="Feedback" user={user} hasActivePlan>
      <SmartForm endpoint="/api/feedback" submitLabel="Submit Feedback">
        <label>Rating<input name="rating" type="number" min="1" max="5" required /></label>
        <label>Message<textarea name="message" required /></label>
      </SmartForm>
      <div className="data-card">
        <h2>Your Feedback</h2>
        {feedback.map((item) => (
          <p key={item.id}>{item.rating}/5 - {item.message}</p>
        ))}
      </div>
    </PortalShell>
  );
}
