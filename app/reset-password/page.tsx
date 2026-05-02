import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Secure Reset</span>
        <h1>Create a new password</h1>
        <p>Choose a new password for your Mittal AI Studio account.</p>
        <ResetPasswordForm />
        <Link className="button secondary" href="/">
          Back to website
        </Link>
      </section>
    </main>
  );
}
