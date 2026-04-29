import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAdminRows, requireAdmin } from "@/lib/server/admin";

export default async function PaymentsAdminPage() {
  const user = await requireAdmin();
  const rows = await getAdminRows("payments");
  return (
    <PortalShell title="Payments and Paid Users" user={user} admin>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="data-card" key={String(row.id)}>
            <h2>{String(row.plan_name || "Payment")}</h2>
            <p>Rs. {Number(row.amount || 0).toLocaleString("en-IN")} - {String(row.status || "")}</p>
            <p><strong>User:</strong> <code>{String(row.user_id || "")}</code></p>
            <p><strong>Payment ID:</strong> <code>{String(row.razorpay_payment_id || "")}</code></p>
            <AdminFieldForm
              table="payments"
              id={String(row.id)}
              fields={[{ name: "status", label: "Status", type: "select", options: ["pending", "paid", "failed", "refunded"], defaultValue: String(row.status || "pending") }]}
              submitLabel="Update Payment"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
