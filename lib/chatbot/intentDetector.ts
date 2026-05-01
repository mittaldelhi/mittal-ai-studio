import type { ChatIntent } from "@/lib/chatbot/types";

const intentMatchers: Array<{ intent: ChatIntent; words: string[] }> = [
  {
    intent: "website_development",
    words: ["website", "site", "web design", "redesign", "landing page", "business website", "pages"],
  },
  {
    intent: "ai_chatbot",
    words: ["chatbot", "chat bot", "bot", "ai assistant", "faq bot", "lead capture bot"],
  },
  {
    intent: "google_business_profile",
    words: ["google business", "gbp", "google map", "maps", "business profile", "google profile"],
  },
  {
    intent: "pricing",
    words: ["price", "pricing", "cost", "charges", "package", "budget", "quote"],
  },
  {
    intent: "support",
    words: ["human", "call me", "callback", "talk to", "support", "agent", "team"],
  },
  {
    intent: "contact",
    words: ["contact", "phone", "whatsapp", "message", "call", "email"],
  },
  {
    intent: "domain_hosting",
    words: ["domain", "hosting", "ssl", "dns", "server"],
  },
  {
    intent: "business_email",
    words: ["business email", "professional email", "email setup", "mailbox"],
  },
  {
    intent: "seo",
    words: ["seo", "search engine", "rank", "ranking", "local seo"],
  },
  {
    intent: "dashboard",
    words: ["dashboard", "admin panel", "portal", "saas", "crm", "panel"],
  },
  {
    intent: "whatsapp_automation",
    words: ["automation", "auto reply", "whatsapp automation", "follow up", "follow-up"],
  },
  {
    intent: "lead_generation",
    words: ["leads", "customers", "sales", "more business", "enquiries", "inquiries"],
  },
];

export function detectIntent(input: string): ChatIntent {
  const message = input.toLowerCase();
  const match = intentMatchers.find(({ words }) => words.some((word) => message.includes(word)));
  return match?.intent || "unknown";
}
