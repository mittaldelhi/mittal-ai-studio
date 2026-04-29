import Link from "next/link";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  detail,
  tone = "blue",
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  tone?: "blue" | "violet" | "green" | "amber" | "slate";
}) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <p>{detail}</p> : null}
    </article>
  );
}

export function SectionCard({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <section className="section-card">
      <div className="section-card-heading">
        <div>
          {eyebrow ? <span>{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        {action ? <Link href={action.href}>{action.label}</Link> : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: { label: string; href: string } }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{body}</p>
      {action ? <Link className="button secondary" href={action.href}>{action.label}</Link> : null}
    </div>
  );
}
