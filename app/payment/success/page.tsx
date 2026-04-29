import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Payment Successful</span>
        <h1>Your plan is active.</h1>
        <p>We have recorded your payment. You can now manage your details and support requests from the dashboard.</p>
        <Link className="button primary" href="/dashboard">
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
