"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage, type LocalChatMessage } from "@/components/chatbot/ChatMessage";
import { LeadForm } from "@/components/chatbot/LeadForm";
import { QuickReplies } from "@/components/chatbot/QuickReplies";
import { TypingIndicator } from "@/components/chatbot/TypingIndicator";
import { WhatsappButton } from "@/components/chatbot/WhatsappButton";
import { defaultQuickReplies } from "@/lib/chatbot/chatbotKnowledge";
import type { ChatQuickReply } from "@/lib/chatbot/types";

type ChatApiResponse = {
  success: boolean;
  data: {
    sessionId?: string;
    visitorId?: string;
    reply: string;
    quickReplies: ChatQuickReply[];
    showLeadForm?: boolean;
    serviceInterest?: string;
    nextContextIntent?: string;
  };
  error: string | null;
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoredVisitorId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = window.localStorage.getItem("mittal-chat-visitor");
  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem("mittal-chat-visitor", next);
  return next;
}

export function ChatWindow({ onClose, onMinimize }: { onClose: () => void; onMinimize: () => void }) {
  const [visitorId] = useState(() => getStoredVisitorId());
  const [sessionId, setSessionId] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem("mittal-chat-session") || "",
  );
  const [messages, setMessages] = useState<LocalChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi! I'm the Mittal AI Studio assistant. I can help you with websites, AI chatbots, Google Business Profile, automation, and lead generation. What do you need help with?",
    },
  ]);
  const [quickReplies, setQuickReplies] = useState<ChatQuickReply[]>(defaultQuickReplies);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [serviceInterest, setServiceInterest] = useState("");
  const [contextIntent, setContextIntent] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sourcePage = typeof window === "undefined" ? "" : window.location.pathname;
  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, showLeadForm]);

  async function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText || isTyping) {
      return;
    }

    setMessages((current) => [...current, { id: makeId("user"), sender: "user", text: cleanText }]);
    setInput("");
    setIsTyping(true);

    const response = await fetch("/api/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: cleanText,
        visitorId,
        sessionId,
        sourcePage,
        contextIntent,
      }),
    }).catch(() => null);

    if (!response) {
      setMessages((current) => [
        ...current,
        {
          id: makeId("bot"),
          sender: "bot",
          text: "I could not connect right now. Please try WhatsApp support for faster help.",
        },
      ]);
      setIsTyping(false);
      return;
    }

    const payload = (await response.json().catch(() => null)) as ChatApiResponse | null;
    const data = payload?.data;
    setIsTyping(false);

    if (!response.ok || !payload?.success || !data) {
      setMessages((current) => [
        ...current,
        {
          id: makeId("bot"),
          sender: "bot",
          text: payload?.error || "I could not answer that right now. Please try WhatsApp support.",
        },
      ]);
      return;
    }

    if (data.sessionId) {
      setSessionId(data.sessionId);
      window.localStorage.setItem("mittal-chat-session", data.sessionId);
    }

    setServiceInterest(data.serviceInterest || serviceInterest);
    setContextIntent(data.nextContextIntent || contextIntent);
    setQuickReplies(data.quickReplies || defaultQuickReplies);
    setShowLeadForm(Boolean(data.showLeadForm));
    setMessages((current) => [...current, { id: makeId("bot"), sender: "bot", text: data.reply }]);
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function clearChat() {
    window.localStorage.removeItem("mittal-chat-session");
    setSessionId("");
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: "Hi, I'm Mittal AI Assistant. How can I help you today?",
      },
    ]);
    setQuickReplies(defaultQuickReplies);
    setShowLeadForm(false);
    setServiceInterest("");
    setContextIntent("");
  }

  return (
    <section className="chatbot-window" aria-label="Mittal AI Assistant">
      <header className="chatbot-header">
        <div className="chatbot-brand">
          <span className="chatbot-logo logo">
            <Image alt="Mittal AI M logo" height={46} src="/mittal-ai-m-clean.png" width={46} />
          </span>
          <div>
            <strong>Mittal AI Assistant</strong>
            <span>Usually replies instantly</span>
          </div>
        </div>
        <div className="chatbot-actions">
          <button type="button" onClick={clearChat} aria-label="Clear chat">
            Clear
          </button>
          <button type="button" onClick={onMinimize} aria-label="Minimize chat">
            -
          </button>
          <button type="button" onClick={onClose} aria-label="Close chat">
            x
          </button>
        </div>
      </header>

      <div className="chatbot-body">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping ? <TypingIndicator /> : null}
        {showLeadForm ? (
          <LeadForm
            sessionId={sessionId}
            visitorId={visitorId}
            sourcePage={sourcePage}
            serviceInterest={serviceInterest}
            onSubmitted={() => {
              setMessages((current) => [
                ...current,
                {
                  id: makeId("bot"),
                  sender: "bot",
                  text: "Thanks! Your details have been submitted. Our team will contact you soon.",
                },
              ]);
            }}
          />
        ) : null}
        <div ref={scrollRef} />
      </div>

      <footer className="chatbot-footer">
        <QuickReplies replies={quickReplies} onSelect={(reply) => void sendMessage(reply.value)} />
        <div className="chatbot-handoff">
          <WhatsappButton serviceInterest={serviceInterest} />
        </div>
        <form className="chatbot-input-row" onSubmit={submitMessage}>
          <input
            aria-label="Chat message"
            placeholder="Type your requirement..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button disabled={!canSend} type="submit">
            Send
          </button>
        </form>
      </footer>
    </section>
  );
}
