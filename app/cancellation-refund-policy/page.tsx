import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy",
  description: "Cancellation and refund policy for Mittal AI Studio digital services and project payments.",
  alternates: {
    canonical: "/cancellation-refund-policy",
  },
};

const refundSections = [
  {
    title: "Project cancellation",
    body: [
      "Customers may request cancellation by contacting Mittal AI Studio through email, phone, WhatsApp, or the support channel used for the project.",
      "Cancellation eligibility depends on the project stage, work already completed, resources allocated, third-party costs, and the terms agreed before work started.",
    ],
  },
  {
    title: "Refund eligibility",
    body: [
      "A refund may be considered if payment was made by mistake, duplicate payment was received, or work has not started and no third-party cost has been incurred.",
      "Once discovery, planning, design, development, setup, automation configuration, strategy, content work, support, or third-party purchase has started, the paid amount may be partly or fully non-refundable depending on completed work.",
    ],
  },
  {
    title: "Non-refundable items",
    body: [
      "Payments for completed work, custom design, custom development, setup services, automation workflows, consultation, domain or hosting guidance, third-party tools, paid plugins, API usage, subscriptions, and approved deliverables may not be refundable.",
      "Government fees, domain purchases, hosting plans, payment gateway charges, third-party software, or external platform charges are controlled by the respective provider and are not refundable by Mittal AI Studio unless the provider issues a refund.",
    ],
  },
  {
    title: "Refund process",
    body: [
      "Approved refunds are processed to the original payment method where possible. The processing time may vary depending on the payment provider, bank, or gateway.",
      "We may request invoice details, payment proof, project reference, and reason for cancellation before reviewing a refund request.",
    ],
  },
  {
    title: "Revisions and support",
    body: [
      "Before requesting cancellation, customers may ask for reasonable corrections or revisions within the agreed project scope.",
      "Any additional work outside the approved scope may require a separate quote or plan upgrade.",
    ],
  },
  {
    title: "How to request cancellation or refund",
    body: [
      "To request cancellation or refund review, contact us with your name, email, phone number, payment details, project name, and reason for the request.",
      "We will review the request and respond with the applicable decision based on project status and agreed terms.",
    ],
  },
];

export default function CancellationRefundPolicyRoute() {
  return (
    <>
      <Navbar />
      <LegalPage
        eyebrow="Cancellation and Refund Policy"
        title="Cancellation and Refund Policy"
        intro="This policy explains how cancellation and refund requests are handled for Mittal AI Studio digital services."
        lastUpdated="May 2, 2026"
        sections={refundSections}
      />
      <Footer />
    </>
  );
}
