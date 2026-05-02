import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({ children, eyebrow, title, description }: AuthShellProps) {
  return (
    <main className="auth-page premium-auth-page">
      <section className="auth-shell">
        <div className="auth-brand-panel" aria-hidden="true">
          <Image
            className="auth-brand-wordmark"
            src="/mittal-ai-studio-horizontal.svg"
            alt=""
            width={360}
            height={100}
            priority
          />
          <div>
            <span>Secure business portal</span>
            <strong>AI growth systems for local businesses</strong>
            <p>Secure access to dashboards, support, payments, project updates, and business automation tools.</p>
          </div>
          <div className="auth-trust-grid">
            <span>SSL secured</span>
            <span>Google login</span>
            <span>Business dashboard</span>
          </div>
        </div>

        <div className="auth-card premium-auth-card">
          <Link className="auth-logo-link" href="/" aria-label="Mittal AI Studio home">
            <span className="auth-logo-surface">
              <Image
                className="auth-logo"
                src="/mittal-ai-studio-horizontal.svg"
                alt="Mittal AI Studio"
                width={360}
                height={100}
                priority
              />
            </span>
          </Link>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
