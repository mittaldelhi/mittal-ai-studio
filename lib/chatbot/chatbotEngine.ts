import {
  defaultQuickReplies,
  fallbackReply,
  chatbotFollowUpReplies,
  googleBusinessFollowUpReplies,
  humanSupportReplies,
  intentReplies,
  leadPrompt,
  pricingPackages,
  serviceLabels,
  websiteFollowUpReplies,
} from "@/lib/chatbot/chatbotKnowledge";
import { detectIntent } from "@/lib/chatbot/intentDetector";
import type { ChatEngineResult, ChatIntent, ChatQuickReply } from "@/lib/chatbot/types";

function repliesForIntent(intent: ChatEngineResult["intent"]): ChatQuickReply[] {
  if (intent === "support" || intent === "contact") {
    return humanSupportReplies;
  }

  if (intent === "pricing") {
    return [
      { label: "Share requirement", value: "I want to submit my details", intent: "support" },
      { label: "Website package", value: "I need website package details", intent: "website_development" },
      { label: "Chatbot package", value: "I need chatbot package details", intent: "ai_chatbot" },
    ];
  }

  return [
    { label: "Submit details", value: "I want to submit my details", intent: "support" },
    { label: "Pricing", value: "Tell me about pricing", intent: "pricing" },
    { label: "WhatsApp support", value: "I want WhatsApp support", intent: "contact" },
  ];
}

function isAffirmative(message: string) {
  return /\b(yes|yeah|yep|have|already|existing|old|current)\b/i.test(message);
}

function isNegative(message: string) {
  return /\b(no|not|don't|dont|do not|new|fresh|nothing|without|nahi|nahin)\b/i.test(message);
}

function isShortFollowUp(message: string) {
  return message.trim().split(/\s+/).length <= 8;
}

function getContextualResponse(message: string, contextIntent?: ChatIntent): ChatEngineResult | null {
  if (!contextIntent || !isShortFollowUp(message)) {
    return null;
  }

  if (contextIntent === "website_development") {
    if (isNegative(message)) {
      return {
        intent: "website_development",
        reply:
          "Got it. If you do not have a website, the best starting point is a clean business website with mobile design, service pages, enquiry buttons, WhatsApp click-to-chat, basic SEO, and Google tracking.\n\nWhat type of business do you have?",
        quickReplies: [
          { label: "Clinic", value: "My business is a clinic", intent: "website_development" },
          { label: "Shop", value: "My business is a shop", intent: "website_development" },
          { label: "Service business", value: "My business is a service business", intent: "website_development" },
          { label: "Submit details", value: "I want to submit my details", intent: "support" },
        ],
        serviceInterest: serviceLabels.website_development,
        nextContextIntent: "website_development",
      };
    }

    if (isAffirmative(message)) {
      return {
        intent: "website_development",
        reply:
          "Understood. If you already have a website, we can redesign it to look more professional, improve speed, make it mobile-friendly, add lead capture, and connect WhatsApp or chatbot support.\n\nWhat is the main problem with your current website?",
        quickReplies: [
          { label: "Old design", value: "My website design is old", intent: "website_development" },
          { label: "No leads", value: "My website does not generate leads", intent: "lead_generation" },
          { label: "Slow website", value: "My website is slow", intent: "website_development" },
        ],
        serviceInterest: "Website Redesign",
        nextContextIntent: "website_development",
      };
    }
  }

  if (contextIntent === "ai_chatbot") {
    return {
      intent: "ai_chatbot",
      reply:
        "That makes sense. We can design the chatbot based on your business FAQs, services, pricing guidance, lead questions, and WhatsApp handoff.\n\nDo you want the chatbot mainly for your website, WhatsApp, or both?",
      quickReplies: chatbotFollowUpReplies,
      serviceInterest: serviceLabels.ai_chatbot,
      nextContextIntent: "ai_chatbot",
    };
  }

  if (contextIntent === "google_business_profile") {
    if (isNegative(message)) {
      return {
        intent: "google_business_profile",
        reply:
          "No problem. We can help create a new Google Business Profile, add correct business details, service categories, photos, location, and a review/enquiry setup.\n\nWhich city or area is your business located in?",
        quickReplies: googleBusinessFollowUpReplies,
        serviceInterest: serviceLabels.google_business_profile,
        nextContextIntent: "google_business_profile",
      };
    }

    if (isAffirmative(message)) {
      return {
        intent: "google_business_profile",
        reply:
          "Good. If you already have a profile, we can optimize categories, photos, posts, keywords, reviews, services, and enquiry actions so it performs better on Google Search and Maps.\n\nIs your main goal more calls, more visits, or better ranking?",
        quickReplies: [
          { label: "More calls", value: "I want more calls", intent: "lead_generation" },
          { label: "Better ranking", value: "I want better ranking", intent: "google_business_profile" },
          { label: "More visits", value: "I want more shop visits", intent: "google_business_profile" },
        ],
        serviceInterest: serviceLabels.google_business_profile,
        nextContextIntent: "google_business_profile",
      };
    }
  }

  return null;
}

export function getChatbotResponse(message: string, contextIntent?: ChatIntent): ChatEngineResult {
  const detectedIntent = detectIntent(message);
  const contextualResponse = detectedIntent === "unknown" ? getContextualResponse(message, contextIntent) : null;

  if (contextualResponse) {
    return contextualResponse;
  }

  const intent = detectedIntent;
  const lowerMessage = message.toLowerCase();
  const wantsLeadForm =
    lowerMessage.includes("submit") ||
    lowerMessage.includes("callback") ||
    lowerMessage.includes("book") ||
    lowerMessage.includes("audit") ||
    lowerMessage.includes("contact details");

  if (wantsLeadForm) {
    return {
      intent: intent === "unknown" ? "support" : intent,
      reply: "Please share your details below. Our team will review your requirement and contact you soon.",
      quickReplies: humanSupportReplies,
      showLeadForm: true,
      serviceInterest: serviceLabels[intent] || serviceLabels.unknown,
      nextContextIntent: "support",
    };
  }

  if (intent === "unknown") {
    return {
      intent,
      reply: `${fallbackReply}\n\n${leadPrompt}`,
      quickReplies: defaultQuickReplies,
      serviceInterest: serviceLabels.unknown,
      nextContextIntent: contextIntent || "unknown",
    };
  }

  const packageNote =
    intent === "pricing" ? `\n\nCommon package types: ${pricingPackages.join(", ")}. Prices can be updated from config later.` : "";

  return {
    intent,
    reply: `${intentReplies[intent] || fallbackReply}${packageNote}`,
    quickReplies:
      intent === "website_development"
        ? websiteFollowUpReplies
        : intent === "ai_chatbot"
          ? chatbotFollowUpReplies
          : intent === "google_business_profile"
            ? googleBusinessFollowUpReplies
            : repliesForIntent(intent),
    showLeadForm: intent === "support" || intent === "contact",
    serviceInterest: serviceLabels[intent],
    nextContextIntent: intent,
  };
}
