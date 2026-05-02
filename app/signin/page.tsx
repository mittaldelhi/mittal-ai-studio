import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginButton } from "@/components/auth/LoginButton";
import { PasswordAuthForm } from "@/components/auth/PasswordAuthForm";

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Customer Login"
      title="Welcome back"
      description="Access your dashboard, payments, support, reviews, and business details."
    >
        <PasswordAuthForm mode="signin" />
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
