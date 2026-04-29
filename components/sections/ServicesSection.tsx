import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const homepageServices = [
  {
    icon: "01",
    title: "Business Website",
    description: "Fast, premium websites with clear offers, lead capture, SEO basics, and mobile-first UX.",
  },
  {
    icon: "02",
    title: "Google Business Profile",
    description: "Profile cleanup, local search signals, posts, photos, reviews workflow, and Maps visibility.",
  },
  {
    icon: "03",
    title: "AI Chatbots",
    description: "Chatbots that answer FAQs, qualify leads, capture details, and hand off to WhatsApp.",
  },
  {
    icon: "04",
    title: "Automation Systems",
    description: "Follow-ups, reminders, reports, CRM updates, and owner-friendly workflows.",
  },
  {
    icon: "05",
    title: "Web & Mobile Apps",
    description: "Customer portals, booking flows, dashboards, and lightweight business applications.",
  },
  {
    icon: "06",
    title: "Branding & Content",
    description: "Brand polish, service storytelling, local campaigns, and AI-assisted content systems.",
  },
];

export function ServicesSection() {
  return (
    <section className="premium-section" id="services">
      <Container>
        <SectionHeader
          eyebrow="Services"
          title="Services built for local business growth."
          description="Websites, Google Business, AI chatbots, automation, apps, branding, SEO, and content systems in one clear setup."
        />
        <div className="premium-service-grid">
          {homepageServices.map((service) => (
            <article className="premium-service-card" key={service.title}>
              <span>{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link href="/services" style={{ color: "var(--primary)" }}>
                Learn more
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
