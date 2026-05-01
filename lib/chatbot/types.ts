export type ChatIntent =
  | "website_development"
  | "ai_chatbot"
  | "google_business_profile"
  | "pricing"
  | "support"
  | "contact"
  | "domain_hosting"
  | "business_email"
  | "seo"
  | "dashboard"
  | "whatsapp_automation"
  | "lead_generation"
  | "unknown";

export type ChatQuickReply = {
  label: string;
  value: string;
  intent?: ChatIntent;
};

export type ChatEngineResult = {
  intent: ChatIntent;
  reply: string;
  quickReplies: ChatQuickReply[];
  showLeadForm?: boolean;
  serviceInterest?: string;
  nextContextIntent?: ChatIntent;
};

export type ChatLeadStatus = "new" | "contacted" | "converted" | "lost";

export type ChatLeadFormInput = {
  sessionId?: string;
  visitorId?: string;
  name: string;
  phone: string;
  email?: string;
  businessName?: string;
  serviceInterest?: string;
  budgetRange?: string;
  timeline?: string;
  city?: string;
  message?: string;
  sourcePage?: string;
};
