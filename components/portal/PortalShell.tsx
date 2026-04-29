import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { hasActivePlan as getHasActivePlan } from "@/lib/server/subscription";
import type { SessionUser } from "@/lib/server/supabase-rest";

const customerLinks = [
  ["Overview", "/dashboard"],
  ["Profile", "/dashboard/profile"],
  ["Password", "/dashboard/password"],
];

const paidLinks = [
  ["Payments", "/dashboard/payments"],
  ["Support", "/dashboard/support"],
  ["Complaints", "/dashboard/complaints"],
  ["Reviews", "/dashboard/reviews"],
  ["Feedback", "/dashboard/feedback"],
];

const adminLinks = [
  ["Admin", "/admin"],
  ["Users", "/admin/users"],
  ["Enquiries", "/admin/enquiries"],
  ["Orders", "/admin/orders"],
  ["Payments", "/admin/payments"],
  ["Support", "/admin/support"],
  ["Complaints", "/admin/complaints"],
  ["Reviews", "/admin/reviews"],
  ["Feedback", "/admin/feedback"],
  ["Work", "/admin/work"],
  ["Analytics", "/admin/analytics"],
  ["Plans", "/admin/settings/plans"],
];

export async function PortalShell({
  user,
  title,
  children,
  admin = false,
  hasActivePlan,
}: {
  user: SessionUser;
  title: string;
  children: React.ReactNode;
  admin?: boolean;
  hasActivePlan?: boolean;
}) {
  const roleLabel = user.profile?.role === "admin" ? "Admin" : user.profile?.role === "support" ? "Support" : "Customer";
  const isPrivileged = user.profile?.role === "admin" || user.profile?.role === "support";
  const effectiveHasActivePlan = admin || isPrivileged || hasActivePlan || (await getHasActivePlan(user.id));
  const links = admin ? adminLinks : [...customerLinks, ...(effectiveHasActivePlan ? paidLinks : [])];

  return (
    <main className="portal-page">
      <aside className="portal-sidebar">
        <Link className="brand portal-brand" href="/">
          Mittal AI Studio
        </Link>
        <div className="portal-user">
          <div className="portal-avatar">
            {user.profile?.avatar_url ? (
              <Image src={user.profile.avatar_url} alt="" width={48} height={48} />
            ) : (
              <span>{user.name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>{user.name}</strong>
            <span>{admin ? `${roleLabel} access` : effectiveHasActivePlan ? "Paid customer" : "Free account"}</span>
          </div>
        </div>
        {!admin && !effectiveHasActivePlan ? (
          <Link className="nav-cta" href="/pricing">
            Unlock Full Dashboard
          </Link>
        ) : null}
        <nav>
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <section className="portal-main">
        <div className="portal-heading">
          <span className="eyebrow">{admin ? "Admin CRM" : "Customer Portal"}</span>
          <h1>{title}</h1>
        </div>
        {children}
      </section>
    </main>
  );
}
