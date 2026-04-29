import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";
import { PasswordAuthForm } from "@/components/auth/PasswordAuthForm";

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Create Account</span>
        <h1>Sign up for Mittal AI Studio</h1>
        <p>Create your account to buy plans, update your business profile, and talk to support.</p>
        <PasswordAuthForm mode="signup" />
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
