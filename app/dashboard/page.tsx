import Link from "next/link";
import { EmptyState, SectionCard, StatCard } from "@/components/portal/DashboardPrimitives";
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
  const serviceCards = [
    ["AI Chatbot", "Capture questions and automate first replies.", "/dashboard/support"],
    ["Business Website", "Keep project requests and delivery details visible.", "/dashboard/profile"],
    ["Google Business Profile", "Share business details for local visibility.", "/dashboard/profile"],
    ["Payments", "Track plan and payment status.", "/dashboard/payments"],
  ];

  return (
    <PortalShell title="Dashboard" user={user} hasActivePlan={hasFullDashboard}>
      <section className="dashboard-hero">
        <div>
          <span>Welcome back</span>
          <h2>{user.name}, your client portal is ready for business updates and support.</h2>
        </div>
        <Link className="button primary" href={hasFullDashboard ? "/dashboard/support" : "/pricing"}>
          {hasFullDashboard ? "Open Support" : "View Plans"}
        </Link>
      </section>
      <div className="metric-grid">
        <StatCard detail="Current access level" label="Active plan" tone="blue" value={activePlan} />
        <StatCard detail="Saved orders" label="Orders" tone="violet" value={orders.length} />
        <StatCard detail="Captured requests" label="Enquiries" tone="green" value={enquiries.length} />
        <StatCard detail="Support threads" label="Support chats" tone="amber" value={threads.length} />
        <StatCard detail="Raised issues" label="Complaints" tone="slate" value={complaints.length} />
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
      <SectionCard eyebrow="Services" title="Your growth tools">
        <div className="module-grid client-module-grid">
          {serviceCards.map(([title, body, href]) => (
            <Link className="module-card" href={href} key={title}>
              <span>{title.slice(0, 2).toUpperCase()}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
      <SectionCard eyebrow="Status" title="Recent requests">
        {orders.length || enquiries.length || threads.length || complaints.length ? (
          <div className="activity-list">
            {orders.slice(0, 2).map((order) => (
              <div className="activity-row" key={order.id}>
                <span>Order</span>
                <strong>{order.plan_name}</strong>
              </div>
            ))}
            {enquiries.slice(0, 2).map((enquiry) => (
              <div className="activity-row" key={enquiry.id}>
                <span>Enquiry</span>
                <strong>{enquiry.business || enquiry.name}</strong>
              </div>
            ))}
            {threads.slice(0, 2).map((thread) => (
              <div className="activity-row" key={thread.id}>
                <span>Support</span>
                <strong>{thread.subject}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            action={{ label: "Complete Profile", href: "/dashboard/profile" }}
            body="Your orders, enquiries, and support conversations will appear here when available."
            title="No activity yet"
          />
        )}
      </SectionCard>
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
