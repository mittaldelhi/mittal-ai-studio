import { ChatLeadsTable } from "@/components/admin/ChatLeadsTable";
import { LeadStatsCards } from "@/components/admin/LeadStatsCards";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireAdmin } from "@/lib/server/admin";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { ChatLead } from "@/lib/types/platform";

export const metadata = {
  title: "Chatbot Leads",
};

async function getChatLeads() {
  return supabaseRest<ChatLead[]>("/rest/v1/chat_leads", {
    service: true,
    query: { select: "*", order: "created_at.desc" },
  }).catch(() => []);
}

export default async function ChatLeadsPage() {
  const user = await requireAdmin();
  const leads = await getChatLeads();

  return (
    <PortalShell title="Chatbot Leads" user={user} admin>
      <section className="dashboard-hero compact">
        <div>
          <span>Chat Support CRM</span>
          <h2>Chatbot lead inbox</h2>
          <p>Review website assistant enquiries, update lead status, and export data for follow-up.</p>
        </div>
      </section>
      <LeadStatsCards leads={leads} />
      <ChatLeadsTable leads={leads} />
    </PortalShell>
  );
}
