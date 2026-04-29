import Link from "next/link";
import { EmptyState, SectionCard, StatCard } from "@/components/portal/DashboardPrimitives";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireAdmin } from "@/lib/server/admin";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { Complaint, Enquiry, Payment, Profile, SupportThread } from "@/lib/types/platform";

const cards = [
  ["Users", "/admin/users"],
  ["Enquiries", "/admin/enquiries"],
  ["Orders", "/admin/orders"],
  ["Payments", "/admin/payments"],
  ["Support", "/admin/support"],
  ["Complaints", "/admin/complaints"],
  ["Reviews", "/admin/reviews"],
  ["Feedback", "/admin/feedback"],
  ["Work", "/admin/work"],
  ["Analytics", "/admin/analytics"],
  ["Plans", "/admin/settings/plans"],
];

export default async function AdminPage() {
  const user = await requireAdmin();
  const [users, enquiries, payments, threads, complaints] = await Promise.all([
    supabaseRest<Profile[]>("/rest/v1/profiles", { service: true, query: { select: "*", order: "created_at.desc" } }).catch(() => []),
    supabaseRest<Enquiry[]>("/rest/v1/enquiries", { service: true, query: { select: "*", order: "created_at.desc" } }).catch(() => []),
    supabaseRest<Payment[]>("/rest/v1/payments", { service: true, query: { select: "*", order: "created_at.desc" } }).catch(() => []),
    supabaseRest<SupportThread[]>("/rest/v1/support_threads", { service: true, query: { select: "*", order: "created_at.desc" } }).catch(() => []),
    supabaseRest<Complaint[]>("/rest/v1/complaints", { service: true, query: { select: "*", order: "created_at.desc" } }).catch(() => []),
  ]);
  const paidUsers = new Set(payments.filter((payment) => payment.status === "paid").map((payment) => payment.user_id)).size;
  const openThreads = threads.filter((thread) => thread.status !== "closed").length;
  const openComplaints = complaints.filter((complaint) => complaint.status !== "closed").length;
  const activity = [...enquiries.slice(0, 3), ...payments.slice(0, 3), ...complaints.slice(0, 3)];

  return (
    <PortalShell title="Admin Control Center" user={user} admin>
      <section className="dashboard-hero">
        <div>
          <span>Operations overview</span>
          <h2>Manage leads, clients, support, work, and payments from one clean workspace.</h2>
        </div>
        <Link className="button primary" href="/admin/enquiries">
          Review Enquiries
        </Link>
      </section>
      <div className="metric-grid">
        <StatCard detail="All portal accounts" label="Total users" tone="blue" value={users.length} />
        <StatCard detail="Customers with paid plan" label="Paid users" tone="green" value={paidUsers} />
        <StatCard detail="Needs first response" label="New enquiries" tone="violet" value={enquiries.filter((item) => item.status === "new").length} />
        <StatCard detail="Active conversations" label="Open support" tone="amber" value={openThreads} />
        <StatCard detail="Needs attention" label="Open complaints" tone="slate" value={openComplaints} />
      </div>
      <SectionCard action={{ label: "Open enquiries", href: "/admin/enquiries" }} eyebrow="Live feed" title="Latest activity">
        {activity.length ? (
          <div className="activity-list">
            {activity.map((item) => (
              <div className="activity-row" key={item.id}>
                <span>{"name" in item ? "Enquiry" : "plan_name" in item ? "Payment" : "Complaint"}</span>
                <strong>{"name" in item ? item.name : "plan_name" in item ? item.plan_name : item.title}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState body="New enquiries, payments, and complaints will appear here." title="No recent activity yet" />
        )}
      </SectionCard>
      <SectionCard eyebrow="Workspace" title="Admin modules">
        <div className="module-grid">
          {cards.map(([label, href]) => (
            <Link className="module-card" href={href} key={href}>
              <span>{label.slice(0, 2).toUpperCase()}</span>
              <strong>{label}</strong>
              <p>Open {label.toLowerCase()} management</p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </PortalShell>
  );
}
