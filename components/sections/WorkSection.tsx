import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { PortfolioProject } from "@/lib/constants/site";

function getInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getWorkImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  const fileName = imageUrl.replace(/\\/g, "/").split("/").pop();
  return fileName ? `/${fileName}` : null;
}

function WorkPreview({ project }: { project: PortfolioProject }) {
  const imageUrl = getWorkImageUrl(project.imageUrl);
  const style = imageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(8, 18, 38, 0.08), rgba(8, 18, 38, 0.54)), url(${imageUrl})`,
      }
    : undefined;

  return (
    <div className={`premium-work-preview${imageUrl ? " has-image" : ""}`} style={style}>
      <span className="premium-work-category">{project.category}</span>
      {!imageUrl ? <div className="premium-work-mark" aria-hidden="true">{getInitials(project.title)}</div> : null}
      <small>{project.city}</small>
    </div>
  );
}

export function WorkSection({ projects }: { projects: PortfolioProject[] }) {
  const visibleProjects = projects.slice(0, 6);

  return (
    <section className="premium-section premium-work-section" id="work">
      <Container>
        <div className="premium-work-grid">
          {visibleProjects.map((project) => (
            <article className="premium-work-card" key={project.title}>
              <WorkPreview project={project} />
              <div className="premium-work-body">
                <div>
                  <span className="premium-work-meta">{project.clientName ?? project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <strong>{project.result}</strong>
                <div className="premium-tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <small key={tag}>{tag}</small>
                  ))}
                </div>
                <div className="premium-work-actions">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} rel="noreferrer" target="_blank">
                      View live
                    </a>
                  ) : (
                    <Link href="/contact">Plan similar</Link>
                  )}
                  <Link href="/contact">Book a similar project</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
