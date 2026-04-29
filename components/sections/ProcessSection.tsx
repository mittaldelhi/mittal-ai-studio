import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { processSteps } from "@/lib/constants/site";

export function ProcessSection() {
  return (
    <section className="premium-section" id="process">
      <Container>
        <SectionHeader
          eyebrow="Process"
          title="A simple path from audit to launch."
          description="We plan, design, build, automate, launch, and improve with clear checkpoints."
        />
        <div className="premium-process-grid">
          {processSteps.slice(0, 6).map((step, index) => (
            <article className="premium-process-card" key={step}>
              <span style={{ color: "var(--primary)" }}>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
