import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password Help"
      title="Reset your password"
      description="Enter your account email and we will send a secure password reset link."
    >
        <ForgotPasswordForm />
        <Link className="button secondary" href="/">
          Back to website
        </Link>
    </AuthShell>
  );
}
