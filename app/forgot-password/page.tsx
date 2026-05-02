import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Password Help</span>
        <h1>Reset your password</h1>
        <p>Enter your account email and we will send a secure password reset link.</p>
        <ForgotPasswordForm />
        <Link className="button secondary" href="/">
          Back to website
        </Link>
      </section>
    </main>
  );
}
