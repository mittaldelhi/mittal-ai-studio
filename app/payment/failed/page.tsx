import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Payment Failed</span>
        <h1>We could not verify this payment.</h1>
        <p>Please try again or contact Mittal AI Studio on WhatsApp for help.</p>
        <Link className="button primary" href="/pricing">
          Try Again
        </Link>
      </section>
    </main>
  );
}
