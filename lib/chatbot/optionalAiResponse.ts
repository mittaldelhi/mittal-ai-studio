import { fallbackReply, intentReplies } from "@/lib/chatbot/chatbotKnowledge";
import type { ChatIntent } from "@/lib/chatbot/types";

const businessKnowledge = `
Mittal AI Studio is an AI business agency in India. Services include business website development, AI chatbot development, Google Business Profile setup and optimization, website redesign, SaaS dashboard and admin panel development, lead generation systems, WhatsApp automation, SEO-ready landing pages, business email and domain setup guidance, and app/web platform development.
Answer from this business context. You may answer simple generic business, website, SEO, chatbot, Google Business Profile, automation, domain, hosting, and marketing questions when they help the visitor.
Keep replies short, natural, helpful, and professional. Ask only one useful next question at a time.
If the visitor appears interested in buying or starting a project, guide them toward sharing details or WhatsApp handoff.
If unsure, offer WhatsApp handoff.
Do not invent fixed prices. Pricing depends on scope, number of pages, features, automation, and support.
`;

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type AiProviderConfig = {
  apiKey: string;
  endpoint: string;
  model: string;
};

function getProviderConfig(): AiProviderConfig | null {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();

  if ((provider === "nvidia" || nvidiaKey) && nvidiaKey) {
    return {
      apiKey: nvidiaKey,
      endpoint: "https://integrate.api.nvidia.com/v1/chat/completions",
      model: process.env.NVIDIA_MODEL?.trim() || "meta/llama-3.1-70b-instruct",
    };
  }

  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (openAiKey) {
    return {
      apiKey: openAiKey,
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    };
  }

  return null;
}

export async function getOptionalAiReply(message: string, intent: ChatIntent) {
  const config = getProviderConfig();

  if (!config) {
    return null;
  }

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        max_tokens: 220,
        stream: false,
        messages: [
          {
            role: "system",
            content: businessKnowledge,
          },
          {
            role: "assistant",
            content: intentReplies[intent] || fallbackReply,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenAiChatResponse;
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
