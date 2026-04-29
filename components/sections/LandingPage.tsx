"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { WorkSection } from "@/components/sections/WorkSection";
import {
  audiences,
  businessInfo,
  type PortfolioProject,
  type PricingPlan,
  processSteps,
  services,
  testimonials,
} from "@/lib/constants/site";
import type { FounderProfile } from "@/lib/server/portfolio";

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  theme?: {
    color?: string;
  };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
};

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function formatPrice(price: number | null) {
  return price === null ? "Custom" : `Rs. ${price.toLocaleString("en-IN")}`;
}

function OauthAlert() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error_code") === "bad_oauth_callback";
  const supabaseCallbackUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/auth/v1/callback`
    : "https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback";

  if (!oauthError) {
    return null;
  }

  return (
    <div className="oauth-alert">
      <strong>Google login callback is misconfigured.</strong>
      <span>
        Add this Google Cloud Authorized redirect URI: {supabaseCallbackUrl}. Google must redirect to Supabase first,
        then Supabase returns the user here.
      </span>
      <Link href="/login">Open login setup</Link>
    </div>
  );
}

export function LandingPage() {
  return (
    <main id="top" className="premium-home">
      <Suspense fallback={null}>
        <OauthAlert />
      </Suspense>
      <HeroSection />
    </main>
  );
}

export function ServicesPage() {
  return (
    <main className="app-main premium-home premium-subpage services-page">
      <section className="page-hero section compact-page-intro">
        <div className="container page-hero-grid compact-page-heading">
          <div>
            <span className="eyebrow">Services</span>
            <h1>Digital growth services for local businesses.</h1>
            <p>Websites, Google Business, AI chatbots, automation, apps, branding, SEO, and content in one clear setup.</p>
          </div>
        </div>
      </section>
      <section className="audience-strip">
        <div className="container audience-grid">
          {audiences.map((audience) => (
            <div key={audience.type}>
              <span>{audience.type}</span>
              <strong>{audience.hook}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.slug}>
              <div className="icon-chip">{String(index + 1).padStart(2, "0")}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span>{service.outcome}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function PortfolioPage({ projects }: { projects: PortfolioProject[] }) {
  return (
    <main className="app-main premium-home premium-subpage portfolio-page">
      <section className="page-hero section compact-page-intro">
        <div className="container page-hero-grid compact-page-heading">
          <div>
            <span className="eyebrow">Work</span>
            <h1>Projects built for real enquiries.</h1>
            <p>Live websites, brand pages, and automation examples made to build local business trust.</p>
          </div>
        </div>
      </section>
      <WorkSection projects={projects} />
    </main>
  );
}

export function ProcessPage() {
  return (
    <main className="app-main premium-home premium-subpage process-page">
      <section className="page-hero section compact-page-intro">
        <div className="container page-hero-grid compact-page-heading">
          <div>
            <span className="eyebrow">Process</span>
            <h1>Simple steps to launch your business online.</h1>
            <p>We understand your needs, build the right solution, launch it, and improve it with real results.</p>
          </div>
        </div>
      </section>
      <section className="section compact-process-section">
        <div className="container process-list">
          {processSteps.map((step, index) => (
            <div className="process-line" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="section split-section">
        <div className="container split-grid">
          <div className="section-heading process-why-heading">
            <span className="eyebrow">Why choose us</span>
            <h2>Smart digital solutions made simple for your business.</h2>
          </div>
          <div className="comparison">
            {[
              ["Traditional vendor", "Makes pages and disappears after handoff."],
              ["Mittal AI Studio", "Builds growth systems with SEO, automation, analytics, and monthly improvement."],
              ["Your result", "More enquiries, faster replies, cleaner follow-up, and a sharper brand impression."],
            ].map(([title, body]) => (
              <div key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function AboutPage({ founder }: { founder: FounderProfile | null }) {
  return (
    <main className="app-main premium-home premium-subpage">
      <section className="section founder-section">
        <div className="container founder-grid">
          <div className="founder-photo-card">
            {founder?.avatarUrl ? (
              <Image src={founder.avatarUrl} alt={founder.name} width={520} height={620} />
            ) : (
              <div className="founder-initial">{founder?.name.slice(0, 1).toUpperCase() || "M"}</div>
            )}
          </div>
          <div className="section-heading left founder-copy">
            <span className="eyebrow">Founder-led Studio</span>
            <h1>{founder?.name || "Mittal AI Studio"}</h1>
            {founder?.role ? <strong>{founder.role}</strong> : null}
            <p>
              {founder?.headline ||
                "A practical AI studio focused on premium websites, automation, SEO, dashboards, and local growth."}
            </p>
            {founder?.bio ? <p>{founder.bio}</p> : null}
            {founder?.highlights?.length ? (
              <div className="tag-row">
                {founder.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            ) : null}
            <div className="hero-actions">
              <Link className="button primary" href="/portfolio">
                View Portfolio
              </Link>
              <a className="button secondary" href={businessInfo.whatsappUrl} target="_blank" rel="noreferrer">
                Talk on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section testimonials">
        <div className="container testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name}>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}

export function PricingPage({ plans }: { plans: PricingPlan[] }) {
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const pricingCopy = useMemo(
    () => "Pick a starter, growth, or custom plan, then confirm the right scope during a callback.",
    [],
  );

  async function handlePayment(plan: PricingPlan) {
    if (!plan.yearly) {
      setPaymentStatus("Enterprise plans need a custom quote first.");
      return;
    }

    setPaymentStatus(`Preparing secure payment for ${plan.name}...`);

    try {
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
          document.body.appendChild(script);
        });
      }

      const response = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: plan.name, amount: plan.yearly }),
      });

      const payload = (await response.json()) as {
        success: boolean;
        data?: { keyId: string; orderId: string; amount: number; currency: string };
        error?: string;
      };

      if (response.status === 401) {
        window.location.assign("/login?next=pricing");
        return;
      }

      if (!response.ok || !payload.success || !payload.data || !window.Razorpay) {
        throw new Error(payload.error || "Unable to start payment.");
      }

      new window.Razorpay({
        key: payload.data.keyId,
        amount: payload.data.amount,
        currency: payload.data.currency,
        name: "Mittal AI Studio",
        description: `${plan.name} yearly plan`,
        order_id: payload.data.orderId,
        theme: { color: "#2563EB" },
        handler: async (razorpayResponse) => {
          const verifyResponse = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...razorpayResponse, planName: plan.name, amount: plan.yearly }),
          });

          window.location.assign(verifyResponse.ok ? "/payment/success" : "/payment/failed");
        },
      }).open();

      setPaymentStatus("Razorpay checkout opened.");
    } catch (error) {
      setPaymentStatus(error instanceof Error ? error.message : "Unable to start Razorpay checkout.");
    }
  }

  return (
    <main className="app-main premium-home premium-subpage pricing-page">
      <section className="page-hero section compact-page-intro">
        <div className="container page-hero-grid compact-page-heading">
          <div>
            <span className="eyebrow">Pricing</span>
            <h1>Yearly plans for every growth stage.</h1>
            <p>{pricingCopy}</p>
          </div>
        </div>
      </section>
      <section className="section pricing-plans-section">
        <div className="container pricing-grid">
          {plans.map((plan) => (
            <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>
              {plan.featured ? <span className="featured-badge">Most chosen</span> : null}
              <h3>{plan.name}</h3>
              <strong>
                {formatPrice(plan.yearly)}
                {plan.yearly ? <small>/year</small> : null}
              </strong>
              <p>{plan.note}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {plan.yearly ? (
                <button className="button secondary" onClick={() => handlePayment(plan)} type="button">
                  Pay with Razorpay
                </button>
              ) : (
                <Link className="button secondary" href="/contact">
                  Request Callback
                </Link>
              )}
            </article>
          ))}
        </div>
        {paymentStatus ? <p className="payment-status">{paymentStatus}</p> : null}
      </section>
    </main>
  );
}

export function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("loading");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Unable to submit");
      }

      form.reset();
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main className="app-main premium-home premium-subpage">
      <section className="section contact-section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Request Callback</span>
            <h1>Talk to us about your business growth.</h1>
            <p>
              Share your goals and we will suggest the fastest website, Google, WhatsApp, chatbot, or automation opportunity.
            </p>
            <div className="data-card contact-details-card">
              <strong>Direct contact</strong>
              <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a>
              <a href={`tel:${businessInfo.phone}`}>{businessInfo.phone}</a>
              <span>{businessInfo.address}</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" required placeholder="Your name" />
            </label>
            <label>
              Business
              <input name="business" required placeholder="Clinic, restaurant, shop..." />
            </label>
            <label>
              Phone or WhatsApp
              <input name="phone" required placeholder="+91..." />
            </label>
            <label>
              What do you want to improve?
              <textarea name="message" required placeholder="More enquiries, booking automation, Google ranking..." />
            </label>
            <button className="button primary" disabled={formState === "loading"} type="submit">
              {formState === "loading" ? "Sending..." : "Request Callback"}
            </button>
            {formState === "success" ? <p className="form-success">Thanks. Your request has been captured.</p> : null}
            {formState === "error" ? <p className="form-error">Something went wrong. Please try WhatsApp instead.</p> : null}
            <a className="whatsapp-link" href={businessInfo.whatsappUrl} target="_blank" rel="noreferrer">
              Continue on WhatsApp: {businessInfo.phone}
            </a>
          </form>
        </div>
      </section>
    </main>
  );
}
