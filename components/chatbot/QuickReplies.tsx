"use client";

import type { ChatQuickReply } from "@/lib/chatbot/types";

export function QuickReplies({
  replies,
  onSelect,
}: {
  replies: ChatQuickReply[];
  onSelect: (reply: ChatQuickReply) => void;
}) {
  if (!replies.length) {
    return null;
  }

  return (
    <div className="chatbot-quick-replies">
      {replies.map((reply) => (
        <button key={`${reply.label}-${reply.value}`} type="button" onClick={() => onSelect(reply)}>
          {reply.label}
        </button>
      ))}
    </div>
  );
}
