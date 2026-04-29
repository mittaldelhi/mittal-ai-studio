import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";
import { PasswordAuthForm } from "@/components/auth/PasswordAuthForm";

export default function SignInPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Customer Login</span>
        <h1>Sign in to Mittal AI Studio</h1>
        <p>Access your dashboard, payments, support, complaints, reviews, and business details.</p>
        <PasswordAuthForm mode="signin" />
        <div className="auth-divider">
          <span>or</span>
        </div>
        <LoginButton />
        <Link className="button secondary" href="/">
          Back to website
        </Link>
      </section>
    </main>
  );
}
