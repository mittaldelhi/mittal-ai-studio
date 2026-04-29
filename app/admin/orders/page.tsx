import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function OrdersAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("orders");
  return (
    <PortalShell title="Orders" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>{String(row.plan_name || "Order")}</h2>
            <p>Rs. {Number(row.amount || 0).toLocaleString("en-IN")} - {String(row.status || "")}</p>
            <p><code>{String(row.razorpay_order_id || row.id)}</code></p>
            <AdminFieldForm
              table="orders"
              id={String(row.id)}
              fields={[{ name: "status", label: "Status", type: "select", options: ["created", "paid", "processing", "completed", "cancelled"], defaultValue: String(row.status || "created") }]}
              submitLabel="Update Order"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
