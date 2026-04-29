import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function EnquiriesAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("enquiries");
  return (
    <PortalShell title="Enquiries" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>{String(row.name || "New enquiry")}</h2>
            <p><strong>Business:</strong> {String(row.business || "")}</p>
            <p><strong>Phone:</strong> {String(row.phone || "")}</p>
            <p>{String(row.message || "")}</p>
            <AdminFieldForm
              table="enquiries"
              id={String(row.id)}
              fields={[{ name: "status", label: "Status", type: "select", options: ["new", "contacted", "qualified", "converted", "closed"], defaultValue: String(row.status || "new") }]}
              submitLabel="Update Status"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
