import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { businessInfo, socialLinks } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-card footer-brand-card">
        <div className="brand footer-brand">
          <Image className="brand-logo" src="/mittal-ai-logo-transparent.png" alt="" width={88} height={88} />
          <div>
            <span>Mittal AI Studio</span>
            <small>AI growth systems for local businesses</small>
          </div>
        </div>
        <p>AI-powered websites, automation, and local growth systems for businesses across Rajasthan.</p>
        <div className="footer-mini-stats">
          <span>Websites</span>
          <span>Automation</span>
          <span>Local SEO</span>
        </div>
        <div className="footer-social-links" aria-label="Mittal AI Studio social links">
          {socialLinks.map((social) => (
            <a href={social.href} key={social.label} target="_blank" rel="noreferrer" aria-label={social.label}>
              <span>
                <SocialIcon name={social.label} />
              </span>
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-card footer-links-card">
        <strong>Explore</strong>
        <div className="footer-grid">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Work</Link>
          <Link href="/process">Process</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="footer-card footer-contact-card">
        <strong>Start a project</strong>
        <p>Share your business goal and get a practical callback for website, Google, WhatsApp, or automation work.</p>
        <div className="footer-contact">
          <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a>
          <a href={`tel:${businessInfo.phone}`}>{businessInfo.phone}</a>
          <span>{businessInfo.address}</span>
        </div>
        <a className="footer-cta" href={businessInfo.whatsappUrl} target="_blank" rel="noreferrer">
          Request Callback
        </a>
      </div>
    </footer>
  );
}
