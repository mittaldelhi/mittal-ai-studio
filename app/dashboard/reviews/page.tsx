import { PortalShell } from "@/components/portal/PortalShell";
import { SmartForm } from "@/components/portal/SmartForm";
import { UpgradeNotice } from "@/components/portal/UpgradeNotice";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import { hasFullDashboardAccess } from "@/lib/server/subscription";
import type { ReviewRequest } from "@/lib/types/platform";

export default async function ReviewsPage() {
  const user = await requireCurrentUser();
  const hasFullDashboard = await hasFullDashboardAccess(user);

  if (!hasFullDashboard) {
    return (
      <PortalShell title="Review Requests" user={user} hasActivePlan={false}>
        <UpgradeNotice />
      </PortalShell>
    );
  }

  const reviews = await supabaseRest<ReviewRequest[]>("/rest/v1/reviews", {
    service: true,
    query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" },
  });

  return (
    <PortalShell title="Review Requests" user={user} hasActivePlan>
      <SmartForm endpoint="/api/reviews" submitLabel="Request Review">
        <label>Service name<input name="service_name" required /></label>
        <label>Message<textarea name="message" required /></label>
      </SmartForm>
      <div className="data-card">
        <h2>Your Requests</h2>
        {reviews.map((review) => (
          <p key={review.id}>{review.service_name} - {review.status}</p>
        ))}
      </div>
    </PortalShell>
  );
}
