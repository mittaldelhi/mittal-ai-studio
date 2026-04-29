import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { stats } from "@/lib/constants/site";

function DashboardMockup() {
  return (
    <div className="premium-dashboard-card" aria-label="AI business dashboard preview">
      <div className="premium-dashboard-top">
        <div>
          <span>AI Growth Console</span>
          <strong>Local Business OS</strong>
        </div>
        <small>Live</small>
      </div>
      <div className="premium-dashboard-metrics">
        <div>
          <span>Leads</span>
          <strong>184</strong>
        </div>
        <div>
          <span>Bookings</span>
          <strong>62</strong>
        </div>
        <div>
          <span>Reviews</span>
          <strong>4.9</strong>
        </div>
      </div>
      <div className="premium-dashboard-chart" aria-hidden="true">
        {[42, 68, 54, 82, 74, 92, 86].map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="premium-dashboard-feed">
        <span>WhatsApp follow-up queued</span>
        <span>Google profile update scheduled</span>
        <span>AI chatbot qualified 14 enquiries</span>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="premium-hero">
      <Container className="premium-hero-grid">
        <div className="premium-hero-copy">
          <Image
            className="premium-hero-logo"
            src="/mittal-ai-logo-transparent.png"
            alt="Mittal AI Studio"
            width={260}
            height={190}
            priority
          />
          <span className="premium-eyebrow">AI growth systems for local businesses</span>
          <h1>Websites, automation, and digital tools that bring more customers.</h1>
          <p>
            Mittal AI Studio builds modern websites, Google Business systems, AI chatbots, WhatsApp automations, and
            apps for growing businesses in India.
          </p>
          <div className="premium-hero-actions">
            <Button href="/contact">Enquire Now</Button>
            <Button href="/portfolio" variant="secondary">
              View Work
            </Button>
          </div>
          <div className="premium-stats">
            {stats.map((stat) => (
              <div className="premium-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <DashboardMockup />
      </Container>
    </section>
  );
}
