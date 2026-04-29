import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pricingPlans } from "@/lib/constants/site";

const homepagePlans = [
  pricingPlans[0],
  pricingPlans[1],
  {
    ...pricingPlans[2],
    name: "Premium / Custom",
    yearly: null,
    note: "For serious operators who need AI workflows, dashboards, and custom implementation.",
    features: ["AI chatbot", "Automation workflows", "Dashboard/CRM", "Priority roadmap"],
  },
];

function formatPrice(value: number | null) {
  return value ? `Rs. ${value.toLocaleString("en-IN")}` : "Custom";
}

export function PricingSection() {
  return (
    <section className="premium-section premium-pricing-section" id="pricing">
      <Container>
        <SectionHeader
          eyebrow="Pricing"
          title="Yearly plans for every growth stage."
          description="Pick a starter, growth, or custom plan, then confirm the right scope during a callback."
        />
        <div className="premium-pricing-grid">
          {homepagePlans.map((plan) => (
            <article className={plan.featured ? "premium-pricing-card featured" : "premium-pricing-card"} key={plan.name}>
              {plan.featured ? <span className="premium-plan-badge">Most Popular</span> : null}
              <h3>{plan.name}</h3>
              <strong>
                {formatPrice(plan.yearly)}
                {plan.yearly ? <small>/year</small> : null}
              </strong>
              <p>{plan.note}</p>
              <ul>
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button href={plan.yearly ? "/pricing" : "/contact"} variant={plan.featured ? "primary" : "secondary"}>
                {plan.yearly ? "View Plan" : "Request Callback"}
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
