import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function UsersAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("profiles");
  return (
    <PortalShell title="Users" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>{String(row.full_name || row.email || "User")}</h2>
            <p>{String(row.email || "")}</p>
            <p>Role: {String(row.role || "customer")}</p>
            <AdminFieldForm
              table="profiles"
              id={String(row.id)}
              fields={[
                { name: "role", label: "Role", type: "select", options: ["customer", "support", "admin"], defaultValue: String(row.role || "customer") },
                { name: "full_name", label: "Full name", defaultValue: String(row.full_name || "") },
                { name: "phone", label: "Phone", defaultValue: String(row.phone || "") },
                { name: "whatsapp", label: "WhatsApp", defaultValue: String(row.whatsapp || "") },
              ]}
              submitLabel="Update User"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
