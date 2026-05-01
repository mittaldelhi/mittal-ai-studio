"use client";

import Image from "next/image";
import { useState } from "react";
import { ChatWindow } from "@/components/chatbot/ChatWindow";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-widget">
      {isOpen ? <ChatWindow onClose={() => setIsOpen(false)} onMinimize={() => setIsOpen(false)} /> : null}
      {!isOpen ? (
        <button className="chatbot-launcher" type="button" onClick={() => setIsOpen(true)} aria-label="Open chat support">
          <span className="chatbot-launcher-icon logo">
            <Image alt="Mittal AI M logo" height={54} src="/mittal-ai-m-clean.png" width={54} priority />
          </span>
          <span>
            <strong>Chat Support</strong>
            <small>Ask AI assistant</small>
          </span>
        </button>
      ) : null}
    </div>
  );
}
