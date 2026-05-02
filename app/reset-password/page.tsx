import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure Reset"
      title="Create a new password"
      description="Choose a strong new password for your Mittal AI Studio account."
    >
        <ResetPasswordForm />
        <Link className="button secondary" href="/">
          Back to website
        </Link>
    </AuthShell>
  );
}
