import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Mittal AI Studio website, digital services, support, and customer projects.",
  alternates: {
    canonical: "/terms",
  },
};

const termsSections = [
  {
    title: "Use of our website",
    body: [
      "By using the Mittal AI Studio website, submitting an enquiry, signing in, or requesting services, you agree to use the website lawfully and not misuse, copy, attack, or interfere with our systems.",
      "The content on this website is provided for business information and service discovery. It should not be treated as legal, financial, or guaranteed business advice.",
    ],
  },
  {
    title: "Our services",
    body: [
      "Mittal AI Studio provides services such as business websites, AI chatbots, Google Business Profile setup and optimization, WhatsApp automation, SEO-ready landing pages, dashboards, app and web platform development, branding, and digital growth systems.",
      "Final project scope, timelines, pricing, revisions, deliverables, and support terms are confirmed separately through proposal, invoice, written message, or project agreement.",
    ],
  },
  {
    title: "Customer responsibilities",
    body: [
      "Customers are responsible for providing accurate business details, brand assets, content, images, domain access, hosting access, Google Business details, and approvals required to complete the project.",
      "Delays in approvals, content, payments, or third-party access may affect delivery timelines.",
    ],
  },
  {
    title: "Payments and refunds",
    body: [
      "Payment terms are shared before project work begins. Work may start only after required advance payment or confirmation is received.",
      "Refund eligibility depends on the agreed scope, work already completed, third-party costs, and project stage. Custom design, development, automation, and setup work may not be refundable once started unless agreed in writing.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "Projects may use third-party services such as Supabase, Google, domain registrars, hosting providers, WhatsApp, email providers, payment gateways, analytics tools, or AI services.",
      "We are not responsible for outages, policy changes, pricing changes, account restrictions, or technical issues caused by third-party platforms.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "After full payment, agreed final deliverables created specifically for the customer may be used by the customer for their business, subject to any third-party licenses or platform terms.",
      "Mittal AI Studio may retain reusable methods, templates, internal tools, frameworks, code patterns, and know-how developed before or during the project.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "We aim to deliver reliable and professional services, but we do not guarantee specific search rankings, leads, revenue, sales, approvals, or uninterrupted platform availability.",
      "To the maximum extent permitted by law, Mittal AI Studio will not be liable for indirect losses, lost profit, lost data, or issues caused by third-party tools, customer changes, or incorrect information supplied to us.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these Terms of Service from time to time. The latest version will be available on this page with the updated date shown above.",
    ],
  },
];

export default function TermsRoute() {
  return (
    <>
      <Navbar />
      <LegalPage
        eyebrow="Terms of Service"
        title="Terms of Service"
        intro="These terms explain the basic rules for using the Mittal AI Studio website and working with us for digital services."
        lastUpdated="May 2, 2026"
        sections={termsSections}
      />
      <Footer />
    </>
  );
}
