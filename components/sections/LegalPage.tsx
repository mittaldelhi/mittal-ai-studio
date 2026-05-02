import { businessInfo } from "@/lib/constants/site";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, intro, lastUpdated, sections }: LegalPageProps) {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <small>Last updated: {lastUpdated}</small>
      </section>

      <section className="legal-card" aria-label={title}>
        {sections.map((section) => (
          <article className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}

        <article className="legal-section legal-contact-panel">
          <h2>Contact Mittal AI Studio</h2>
          <p>
            For questions about this page, contact us at{" "}
            <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a> or call{" "}
            <a href={`tel:${businessInfo.phone}`}>{businessInfo.phone}</a>.
          </p>
          <p>{businessInfo.address}</p>
        </article>
      </section>
    </main>
  );
}
