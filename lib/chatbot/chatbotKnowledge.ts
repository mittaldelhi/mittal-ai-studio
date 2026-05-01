import type { ChatIntent, ChatQuickReply } from "@/lib/chatbot/types";

export const defaultQuickReplies: ChatQuickReply[] = [
  { label: "Build a website", value: "I need a business website", intent: "website_development" },
  { label: "Need AI chatbot", value: "I need an AI chatbot", intent: "ai_chatbot" },
  { label: "Google Business Profile", value: "I need Google Business Profile help", intent: "google_business_profile" },
  { label: "Pricing", value: "Tell me about pricing", intent: "pricing" },
  { label: "Talk to human", value: "I want to talk to a human", intent: "support" },
  { label: "WhatsApp support", value: "I want WhatsApp support", intent: "contact" },
];

export const humanSupportReplies: ChatQuickReply[] = [
  { label: "Continue on WhatsApp", value: "Open WhatsApp support", intent: "contact" },
  { label: "Submit contact details", value: "I want to submit my details", intent: "support" },
  { label: "Request callback", value: "Request a callback", intent: "support" },
];

export const pricingPackages = [
  "Starter Website",
  "Business Website",
  "Premium Website",
  "AI Chatbot Setup",
  "Google Business Profile Setup",
  "Complete Digital Presence Package",
];

export const serviceLabels: Record<ChatIntent, string> = {
  website_development: "Business Website",
  ai_chatbot: "AI Chatbot",
  google_business_profile: "Google Business Profile",
  pricing: "Pricing Guidance",
  support: "Human Support",
  contact: "Contact",
  domain_hosting: "Domain and Hosting",
  business_email: "Business Email",
  seo: "SEO Landing Pages",
  dashboard: "SaaS Dashboard",
  whatsapp_automation: "WhatsApp Automation",
  lead_generation: "Lead Generation",
  unknown: "General Requirement",
};

export const intentReplies: Partial<Record<ChatIntent, string>> = {
  website_development:
    "We can build a professional business website that is mobile-friendly, fast, SEO-ready, and designed to generate enquiries. Do you already have a website or do you want a new one?",
  ai_chatbot:
    "We can build an AI chatbot for your website that answers FAQs, captures leads, qualifies customers, and hands off serious enquiries to WhatsApp. Do you want it for your website, WhatsApp, or both?",
  google_business_profile:
    "We can set up or optimize your Google Business Profile so customers can find your business on Google Search and Maps. Do you already have a Google Business Profile?",
  pricing:
    "Pricing depends on your requirement, features, number of pages, chatbot flow, automation, and support needs. Share your requirement and our team will suggest the best package.",
  support:
    "Sure, I can connect you with the Mittal AI Studio team. You can continue on WhatsApp, submit your details, or request a callback.",
  contact:
    "You can reach Mittal AI Studio through WhatsApp for the fastest response. I can also collect your details so the team can call you back.",
  domain_hosting:
    "Yes, we guide businesses with domain purchase, hosting setup, DNS, SSL, and launch support so the website goes live properly.",
  business_email:
    "Yes, we can guide you with business email setup for your domain, including professional email addresses and basic configuration.",
  seo:
    "We build SEO-ready landing pages with clear structure, local keywords, fast performance, and enquiry-focused sections for local business growth.",
  dashboard:
    "Yes, we build SaaS dashboards, admin panels, customer portals, lead management systems, and internal business tools.",
  whatsapp_automation:
    "We can create WhatsApp automation for auto replies, lead capture, follow-ups, booking flows, and human handoff.",
  lead_generation:
    "For more customers, we usually recommend Google Business Profile optimization, a lead-focused landing page, WhatsApp automation, and an AI chatbot.",
};

export const fallbackReply =
  "I'm not fully sure about that. I can connect you with the Mittal AI Studio team on WhatsApp, or you can share your requirement and I will guide you.";

export const leadPrompt =
  "To guide you properly, please share your business type and the main goal: more leads, better design, automation, online presence, booking, or sales.";

export const websiteFollowUpReplies: ChatQuickReply[] = [
  { label: "Business website", value: "I need a business website", intent: "website_development" },
  { label: "Landing page", value: "I need a landing page for leads", intent: "website_development" },
  { label: "Submit details", value: "I want to submit my details", intent: "support" },
];

export const chatbotFollowUpReplies: ChatQuickReply[] = [
  { label: "Website chatbot", value: "I need chatbot for website", intent: "ai_chatbot" },
  { label: "WhatsApp chatbot", value: "I need WhatsApp chatbot", intent: "whatsapp_automation" },
  { label: "Both", value: "I need chatbot for website and WhatsApp", intent: "ai_chatbot" },
];

export const googleBusinessFollowUpReplies: ChatQuickReply[] = [
  { label: "Create new profile", value: "I need a new Google Business Profile", intent: "google_business_profile" },
  { label: "Optimize existing", value: "I have Google Business Profile but need optimization", intent: "google_business_profile" },
  { label: "Submit details", value: "I want to submit my details", intent: "support" },
];
