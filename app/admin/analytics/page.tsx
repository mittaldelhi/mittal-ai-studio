import { PortalShell } from "@/components/portal/PortalShell";
import { requireAdmin } from "@/lib/server/admin";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { Complaint, Enquiry, Payment, Profile, SupportThread } from "@/lib/types/platform";

export default async function AnalyticsAdminPage() {
  const user = await requireAdmin();
  const [users, enquiries, payments, threads, complaints] = await Promise.all([
    supabaseRest<Profile[]>("/rest/v1/profiles", { service: true, query: { select: "*" } }),
    supabaseRest<Enquiry[]>("/rest/v1/enquiries", { service: true, query: { select: "*" } }),
    supabaseRest<Payment[]>("/rest/v1/payments", { service: true, query: { select: "*" } }),
    supabaseRest<SupportThread[]>("/rest/v1/support_threads", { service: true, query: { select: "*" } }),
    supabaseRest<Complaint[]>("/rest/v1/complaints", { service: true, query: { select: "*" } }),
  ]);
  const revenue = payments.filter((payment) => payment.status === "paid").reduce((total, payment) => total + payment.amount, 0);
  const paidUsers = new Set(payments.filter((payment) => payment.status === "paid").map((payment) => payment.user_id)).size;
  const openComplaints = complaints.filter((complaint) => complaint.status !== "closed").length;
  const openThreads = threads.filter((thread) => thread.status !== "closed").length;
  const conversionRate = users.length ? Math.round((paidUsers / users.length) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const dailyEnquiries = enquiries.filter((enquiry) => enquiry.created_at.startsWith(today)).length;

  return (
    <PortalShell title="Analytics" user={user} admin>
      <div className="metric-grid">
        <article><span>Users</span><strong>{users.length}</strong></article>
        <article><span>Enquiries</span><strong>{enquiries.length}</strong></article>
        <article><span>Revenue</span><strong>Rs. {revenue.toLocaleString("en-IN")}</strong></article>
        <article><span>Paid Users</span><strong>{paidUsers}</strong></article>
        <article><span>Conversion Rate</span><strong>{conversionRate}%</strong></article>
        <article><span>Daily Enquiries</span><strong>{dailyEnquiries}</strong></article>
        <article><span>Open Complaints</span><strong>{openComplaints}</strong></article>
        <article><span>Open Chats</span><strong>{openThreads}</strong></article>
      </div>
    </PortalShell>
  );
}
