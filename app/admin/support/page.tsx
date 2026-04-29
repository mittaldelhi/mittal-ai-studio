import { AdminFieldForm } from "@/components/portal/AdminFieldForm";
import { PortalShell } from "@/components/portal/PortalShell";
import { SupportReplyForm } from "@/components/portal/SupportReplyForm";
import { requireAdmin } from "@/lib/server/admin";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { SupportMessage, SupportThread } from "@/lib/types/platform";

export default async function SupportAdminPage() {
  const user = await requireAdmin();
  const [threads, messages] = await Promise.all([
    supabaseRest<SupportThread[]>("/rest/v1/support_threads", { service: true, query: { select: "*", order: "created_at.desc" } }),
    supabaseRest<SupportMessage[]>("/rest/v1/support_messages", { service: true, query: { select: "*", order: "created_at.asc" } }),
  ]);

  return (
    <PortalShell title="Support Threads" user={user} admin>
      <div className="data-card">
        <h2>Live Support Queue</h2>
        {threads.map((thread) => (
          <article className="thread-card" key={thread.id}>
            <div>
              <strong>{thread.subject}</strong>
              <span>{thread.status}</span>
              <code>{thread.user_id}</code>
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
            <SupportReplyForm threadId={thread.id} label="Reply as Admin" />
            <AdminFieldForm
              table="support_threads"
              id={thread.id}
              fields={[{ name: "status", label: "Thread status", type: "select", options: ["open", "in_progress", "resolved", "closed"], defaultValue: thread.status }]}
              submitLabel="Update Thread"
            />
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
