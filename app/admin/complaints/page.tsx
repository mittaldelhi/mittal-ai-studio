import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function ComplaintsAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("complaints");
  return (
    <PortalShell title="Complaints" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>{String(row.title || "Complaint")}</h2>
            <p>{String(row.description || "")}</p>
            <p>Status: {String(row.status || "open")}</p>
            {row.admin_response ? <p><strong>Response:</strong> {String(row.admin_response)}</p> : null}
            <AdminFieldForm
              table="complaints"
              id={String(row.id)}
              fields={[
                { name: "status", label: "Status", type: "select", options: ["open", "in_progress", "resolved", "closed"], defaultValue: String(row.status || "open") },
                { name: "admin_response", label: "Admin response", type: "textarea", defaultValue: String(row.admin_response || "") },
              ]}
              submitLabel="Reply / Update"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
