"use client";

import { businessInfo } from "@/lib/constants/site";

function getWhatsappNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || businessInfo.phone).replace(/\D/g, "");
}

export function buildWhatsappUrl(serviceInterest?: string) {
  const requirement = serviceInterest || "General Requirement";
  const message = `Hi Mittal AI Studio, I am interested in your services. My requirement is: ${requirement}. Please contact me.`;
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function WhatsappButton({ serviceInterest }: { serviceInterest?: string }) {
  return (
    <a className="chatbot-whatsapp" href={buildWhatsappUrl(serviceInterest)} rel="noreferrer" target="_blank">
      Talk on WhatsApp
    </a>
  );
}
