import { PortalShell } from "@/components/portal/PortalShell";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import { getActivePayment } from "@/lib/server/subscription";
import type { Complaint, Enquiry, Order, Payment, SupportThread } from "@/lib/types/platform";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const [orders, payments, enquiries, threads, complaints] = await Promise.all([
    supabaseRest<Order[]>("/rest/v1/orders", { service: true, query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" } }),
    supabaseRest<Payment[]>("/rest/v1/payments", { service: true, query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" } }),
    supabaseRest<Enquiry[]>("/rest/v1/enquiries", { service: true, query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" } }),
    supabaseRest<SupportThread[]>("/rest/v1/support_threads", {
      service: true,
      query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" },
    }),
    supabaseRest<Complaint[]>("/rest/v1/complaints", { service: true, query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" } }),
  ]);

  const activePayment = (await getActivePayment(user.id)) || payments.find((payment) => payment.status === "paid") || null;
  const isAdmin = user.profile?.role === "admin" || user.profile?.role === "support";
  const hasFullDashboard = isAdmin || Boolean(activePayment);
  const activePlan = activePayment?.plan_name || "Free account";

  return (
    <PortalShell title="Dashboard" user={user} hasActivePlan={hasFullDashboard}>
      <div className="metric-grid">
        <article><span>Active Plan</span><strong>{activePlan}</strong></article>
        <article><span>Orders</span><strong>{orders.length}</strong></article>
        <article><span>Enquiries</span><strong>{enquiries.length}</strong></article>
        <article><span>Support Chats</span><strong>{threads.length}</strong></article>
        <article><span>Complaints</span><strong>{complaints.length}</strong></article>
      </div>
      {!hasFullDashboard ? (
        <div className="data-card">
          <h2>Basic dashboard active</h2>
          <p>You can update your profile and password now. Buy a yearly plan to unlock payments, support chat, complaints, review requests, and feedback tools.</p>
          <a className="button primary" href="/pricing">
            View Plans
          </a>
        </div>
      ) : null}
      {isAdmin ? (
        <div className="data-card">
          <h2>Admin recognised</h2>
          <p>This account is recognised as {user.profile?.role}. Admin access is controlled by the role value in the Supabase profiles table.</p>
          <a className="button primary" href="/admin">
            Open Admin CRM
          </a>
        </div>
      ) : null}
    </PortalShell>
  );
}
