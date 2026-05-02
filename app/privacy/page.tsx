import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Mittal AI Studio website, services, lead forms, support, and Google login.",
  alternates: {
    canonical: "/privacy",
  },
};

const privacySections = [
  {
    title: "Information we collect",
    body: [
      "We collect information that you share with us through contact forms, chatbot conversations, enquiry forms, email, phone, WhatsApp, Google login, or project onboarding.",
      "This may include your name, email address, phone number, business name, city, service interest, project requirement, budget range, and messages shared with our team.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "We use your information to respond to enquiries, provide quotes, deliver services, manage projects, improve our website, and offer support related to websites, automation, chatbots, Google Business Profile, SEO, dashboards, apps, and branding services.",
      "If you contact us through WhatsApp, email, or phone, we may use those same channels to reply about your requirement.",
    ],
  },
  {
    title: "Google login",
    body: [
      "When you sign in with Google, we use Google OAuth through Supabase to authenticate your account. We request only basic profile information such as your name, email address, and profile image where available.",
      "We do not ask for access to your Gmail, Drive, Calendar, contacts, or other sensitive Google data.",
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "Our website may use cookies or similar technologies for login sessions, theme preference, security, analytics, and basic website performance measurement.",
      "You can control cookies through your browser settings, but some login or account features may not work correctly if required cookies are disabled.",
    ],
  },
  {
    title: "Data sharing",
    body: [
      "We do not sell your personal information. We may share limited data with trusted service providers only when needed to operate the website, authentication, hosting, database, payment, email, analytics, or support systems.",
      "We may disclose information if required by law, to protect our rights, or to prevent misuse of our services.",
    ],
  },
  {
    title: "Data security",
    body: [
      "We use reasonable technical and organizational measures to protect your information. However, no internet-based service can be guaranteed to be completely secure.",
      "You are responsible for keeping your account login details safe and for contacting us if you believe your account has been misused.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may ask us to update, correct, or delete your personal information where legally permitted. You can also request that we stop contacting you for marketing or follow-up communication.",
      "To make a request, contact us using the details at the bottom of this page.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the updated date shown above.",
    ],
  },
];

export default function PrivacyRoute() {
  return (
    <>
      <Navbar />
      <LegalPage
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        intro="This policy explains how Mittal AI Studio collects, uses, stores, and protects information shared through our website and services."
        lastUpdated="May 2, 2026"
        sections={privacySections}
      />
      <Footer />
    </>
  );
}
