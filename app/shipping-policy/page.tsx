import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping and delivery policy for Mittal AI Studio digital services and online deliverables.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

const shippingSections = [
  {
    title: "Digital service delivery",
    body: [
      "Mittal AI Studio provides digital services such as websites, dashboards, AI chatbots, Google Business Profile setup, automation workflows, branding, SEO-ready pages, and app or web platform development.",
      "Most deliverables are provided digitally through website links, project previews, email, WhatsApp, dashboard access, cloud folders, or other agreed online channels.",
    ],
  },
  {
    title: "No physical shipping",
    body: [
      "We generally do not ship physical products. Therefore, shipping charges, courier tracking, and physical delivery timelines do not normally apply to our services.",
      "If a project ever includes a physical item, the shipping method, cost, delivery location, and expected timeline will be confirmed separately before dispatch.",
    ],
  },
  {
    title: "Delivery timelines",
    body: [
      "Project timelines depend on the selected service, confirmed scope, content availability, payment status, approvals, third-party access, and technical complexity.",
      "Estimated delivery dates shared during quotation or onboarding are practical estimates, not guaranteed dates, unless specifically agreed in writing.",
    ],
  },
  {
    title: "Customer inputs and approvals",
    body: [
      "Customers are responsible for providing required business details, content, images, domain access, hosting access, Google Business Profile access, brand assets, and timely approvals.",
      "Delays in receiving content, access, feedback, or payment may extend the delivery timeline.",
    ],
  },
  {
    title: "Delivery confirmation",
    body: [
      "A digital service may be considered delivered when the agreed website, page, dashboard, setup, file, preview, automation, or access link has been shared with the customer through an agreed communication channel.",
      "Post-delivery support, revisions, or updates will follow the support and revision terms agreed for the specific project or plan.",
    ],
  },
];

export default function ShippingPolicyRoute() {
  return (
    <>
      <Navbar />
      <LegalPage
        eyebrow="Shipping Policy"
        title="Shipping Policy"
        intro="This policy explains how Mittal AI Studio delivers digital services and project assets to customers."
        lastUpdated="May 2, 2026"
        sections={shippingSections}
      />
      <Footer />
    </>
  );
}
