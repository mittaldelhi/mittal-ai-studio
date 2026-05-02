"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";

type PortalLink = {
  label: string;
  href: string;
  short: string;
};

function isActivePath(pathname: string, href: string) {
  return href === "/dashboard" || href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function PortalNav({
  links,
  pathname,
  onNavigate,
}: {
  links: PortalLink[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="portal-nav" aria-label="Dashboard navigation">
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);

        return (
          <Link aria-current={active ? "page" : undefined} className={active ? "active" : ""} href={link.href} key={link.href} onClick={onNavigate}>
            <span aria-hidden="true">{link.short}</span>
            <strong>{link.label}</strong>
          </Link>
        );
      })}
    </nav>
  );
}

export function PortalSidebar({
  links,
  userName,
  roleLabel,
  accountLabel,
  avatarUrl,
  admin,
  showUpgrade,
}: {
  links: PortalLink[];
  userName: string;
  roleLabel: string;
  accountLabel: string;
  avatarUrl?: string | null;
  admin?: boolean;
  showUpgrade?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="portal-sidebar">
      <details className="portal-mobile-drawer">
        <summary>
          <span>Menu</span>
          <strong>{admin ? "Admin CRM" : "Client Portal"}</strong>
        </summary>
        <div className="portal-mobile-panel">
          <Link className="portal-home-link mobile" href="/">
            Home
          </Link>
          <PortalNav links={links} pathname={pathname} />
          {showUpgrade ? (
            <Link className="nav-cta" href="/pricing">
              Unlock Full Dashboard
            </Link>
          ) : null}
          <LogoutButton />
        </div>
      </details>

      <div className="portal-sidebar-inner">
        <Link className="brand portal-brand" href="/">
          <span className="portal-brand-mark">M</span>
          <span>Mittal AI Studio</span>
        </Link>
        <div className="portal-user">
          <div className="portal-avatar">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" width={44} height={44} />
            ) : (
              <span>{userName.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>{userName}</strong>
            <span>{accountLabel}</span>
          </div>
        </div>
        <div className="portal-role-pill">{roleLabel}</div>
        {showUpgrade ? (
          <Link className="nav-cta" href="/pricing">
            Unlock Full Dashboard
          </Link>
        ) : null}
        <PortalNav links={links} pathname={pathname} />
        <LogoutButton />
      </div>
    </aside>
  );
}
