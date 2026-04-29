import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function FeedbackAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("feedback");
  return (
    <PortalShell title="Feedback" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>Rating: {String(row.rating || "")}/5</h2>
            <p>{String(row.message || "")}</p>
            <p><code>{String(row.user_id || "Public feedback")}</code></p>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
