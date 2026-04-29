import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { hasActivePlan as getHasActivePlan } from "@/lib/server/subscription";
import type { SessionUser } from "@/lib/server/supabase-rest";

const customerLinks = [
  { label: "Overview", href: "/dashboard", short: "OV" },
  { label: "Profile", href: "/dashboard/profile", short: "PR" },
  { label: "Password", href: "/dashboard/password", short: "PW" },
];

const paidLinks = [
  { label: "Payments", href: "/dashboard/payments", short: "PY" },
  { label: "Support", href: "/dashboard/support", short: "SP" },
  { label: "Complaints", href: "/dashboard/complaints", short: "CP" },
  { label: "Reviews", href: "/dashboard/reviews", short: "RV" },
  { label: "Feedback", href: "/dashboard/feedback", short: "FB" },
];

const adminLinks = [
  { label: "Admin", href: "/admin", short: "AD" },
  { label: "Users", href: "/admin/users", short: "US" },
  { label: "Enquiries", href: "/admin/enquiries", short: "EQ" },
  { label: "Orders", href: "/admin/orders", short: "OR" },
  { label: "Payments", href: "/admin/payments", short: "PY" },
  { label: "Support", href: "/admin/support", short: "SP" },
  { label: "Complaints", href: "/admin/complaints", short: "CP" },
  { label: "Reviews", href: "/admin/reviews", short: "RV" },
  { label: "Feedback", href: "/admin/feedback", short: "FB" },
  { label: "Work", href: "/admin/work", short: "WK" },
  { label: "Analytics", href: "/admin/analytics", short: "AN" },
  { label: "Plans", href: "/admin/settings/plans", short: "PL" },
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
  const accountLabel = admin ? `${roleLabel} access` : effectiveHasActivePlan ? "Paid customer" : "Free account";

  return (
    <main className="portal-page">
      <PortalSidebar
        accountLabel={accountLabel}
        admin={admin}
        avatarUrl={user.profile?.avatar_url}
        links={links}
        roleLabel={roleLabel}
        showUpgrade={!admin && !effectiveHasActivePlan}
        userName={user.name}
      />
      <section className="portal-main">
        <header className="portal-topbar">
          <div className="portal-heading">
            <span className="eyebrow">{admin ? "Admin CRM" : "Customer Portal"}</span>
            <h1>{title}</h1>
          </div>
          <div className="portal-topbar-actions">
            <span>{accountLabel}</span>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
