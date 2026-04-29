import { PortalShell } from "@/components/portal/PortalShell";
import { SmartForm } from "@/components/portal/SmartForm";
import { SupportReplyForm } from "@/components/portal/SupportReplyForm";
import { UpgradeNotice } from "@/components/portal/UpgradeNotice";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import { hasFullDashboardAccess } from "@/lib/server/subscription";
import type { SupportMessage, SupportThread } from "@/lib/types/platform";

export default async function SupportPage() {
  const user = await requireCurrentUser();
  const hasFullDashboard = await hasFullDashboardAccess(user);

  if (!hasFullDashboard) {
    return (
      <PortalShell title="Support Chat" user={user} hasActivePlan={false}>
        <UpgradeNotice />
      </PortalShell>
    );
  }

  const threads = await supabaseRest<SupportThread[]>("/rest/v1/support_threads", {
    service: true,
    query: { user_id: `eq.${user.id}`, select: "*", order: "created_at.desc" },
  });
  const messages = threads.length
    ? await supabaseRest<SupportMessage[]>("/rest/v1/support_messages", {
        service: true,
        query: { thread_id: `in.(${threads.map((thread) => thread.id).join(",")})`, select: "*", order: "created_at.asc" },
      })
    : [];

  return (
    <PortalShell title="Support Chat" user={user} hasActivePlan>
      <SmartForm endpoint="/api/support/messages" submitLabel="Send Message">
        <label>Subject<input name="subject" required placeholder="Website, payment, chatbot..." /></label>
        <label>Message<textarea name="message" required placeholder="Tell us what you need help with." /></label>
      </SmartForm>
      <div className="data-card">
        <h2>Your Threads</h2>
        {threads.map((thread) => (
          <article className="thread-card" key={thread.id}>
            <div>
              <strong>{thread.subject}</strong>
              <span>{thread.status}</span>
            </div>
            <div className="message-list">
              {messages
                .filter((message) => message.thread_id === thread.id)
                .map((message) => (
                  <p key={message.id}>
                    <strong>{message.sender_role}:</strong> {message.message}
                  </p>
                ))}
            </div>
            <SupportReplyForm threadId={thread.id} />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
