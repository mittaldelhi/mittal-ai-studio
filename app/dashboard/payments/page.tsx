import { PortalShell } from "@/components/portal/PortalShell";
import { UpgradeNotice } from "@/components/portal/UpgradeNotice";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import { hasFullDashboardAccess } from "@/lib/server/subscription";
import type { Order, Payment } from "@/lib/types/platform";

export default async function PaymentsPage() {
  const user = await requireCurrentUser();
  const hasFullDashboard = await hasFullDashboardAccess(user);

  if (!hasFullDashboard) {
    return (
      <PortalShell title="Payments and Orders" user={user} hasActivePlan={false}>
        <UpgradeNotice />
      </PortalShell>
    );
  }

  const [orders, payments] = await Promise.all([
    supabaseRest<Order[]>("/rest/v1/orders", { service: true, query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" } }),
    supabaseRest<Payment[]>("/rest/v1/payments", { service: true, query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" } }),
  ]);

  return (
    <PortalShell title="Payments and Orders" user={user} hasActivePlan>
      <div className="data-card">
        <h2>Orders</h2>
        {orders.map((order) => (
          <p key={order.id}>{order.plan_name} - Rs. {order.amount.toLocaleString("en-IN")} - {order.status}</p>
        ))}
      </div>
      <div className="data-card">
        <h2>Payments</h2>
        {payments.map((payment) => (
          <p key={payment.id}>{payment.plan_name} - Rs. {payment.amount.toLocaleString("en-IN")} - {payment.status}</p>
        ))}
      </div>
    </PortalShell>
  );
}
