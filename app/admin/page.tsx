import Link from "next/link";
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

  return (
    <PortalShell title="Admin Control Center" user={user} admin>
      <div className="metric-grid">
        <article><span>Total Users</span><strong>{users.length}</strong></article>
        <article><span>Paid Users</span><strong>{paidUsers}</strong></article>
        <article><span>New Enquiries</span><strong>{enquiries.filter((item) => item.status === "new").length}</strong></article>
        <article><span>Open Support</span><strong>{openThreads}</strong></article>
        <article><span>Open Complaints</span><strong>{openComplaints}</strong></article>
      </div>
      <div className="data-card">
        <h2>Latest activity</h2>
        {[...enquiries.slice(0, 3), ...payments.slice(0, 3), ...complaints.slice(0, 3)].map((item) => (
          <p key={item.id}>
            <strong>{"name" in item ? "Enquiry" : "plan_name" in item ? "Payment" : "Complaint"}:</strong>{" "}
            {"name" in item ? item.name : "plan_name" in item ? item.plan_name : item.title}
          </p>
        ))}
      </div>
      <div className="metric-grid">
        {cards.map(([label, href]) => (
          <Link className="data-card" href={href} key={href}>
            <strong>{label}</strong>
            <p>Open {label.toLowerCase()} management</p>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
