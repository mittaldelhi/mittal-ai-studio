import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { businessInfo } from "@/lib/constants/site";

export function CTASection() {
  return (
    <section className="premium-section premium-cta-section" id="contact">
      <Container>
        <div className="premium-cta-card">
          <span className="premium-eyebrow">AI business enquiry</span>
          <h2>Request a callback for your business.</h2>
          <p>
            Share your goals and we will suggest the fastest website, Google, WhatsApp, chatbot, or automation opportunity.
          </p>
          <div className="premium-hero-actions">
            <Button href="/contact">Request Callback</Button>
            <Button href={businessInfo.whatsappUrl} external variant="secondary">
              Continue on WhatsApp
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
