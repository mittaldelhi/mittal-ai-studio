import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function ReviewsAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("reviews");
  return (
    <PortalShell title="Review Requests" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>{String(row.service_name || "Review request")}</h2>
            <p>{String(row.message || "")}</p>
            <AdminFieldForm
              table="reviews"
              id={String(row.id)}
              fields={[{ name: "status", label: "Status", type: "select", options: ["requested", "sent", "completed", "closed"], defaultValue: String(row.status || "requested") }]}
              submitLabel="Update Review"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
