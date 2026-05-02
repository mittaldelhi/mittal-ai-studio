import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginButton } from "@/components/auth/LoginButton";
import { PasswordAuthForm } from "@/components/auth/PasswordAuthForm";

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create Account"
      title="Create your account"
      description="Start your Mittal AI Studio portal for plans, profile updates, project support, and payments."
    >
        <PasswordAuthForm mode="signup" />
        <div className="auth-divider">
          <span>or</span>
        </div>
        <LoginButton />
        <Link className="button secondary" href="/">
          Back to website
        </Link>
    </AuthShell>
  );
}
