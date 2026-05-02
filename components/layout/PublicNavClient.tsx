"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { businessInfo } from "@/lib/constants/site";

type PublicNavClientProps = {
  userName?: string;
  isAdmin: boolean;
  hasDashboard: boolean;
};

const primaryLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Work", "/portfolio"],
  ["Process", "/process"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"],
];

const secondaryLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Work", "/portfolio"],
  ["Process", "/process"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"],
  ["About", "/about"],
];

export function PublicNavClient({ userName, isAdmin, hasDashboard }: PublicNavClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const firstName = userName?.split(" ")[0];
  const displayName = firstName || "Account";

  function closeMenus() {
    setMenuOpen(false);
    setAccountOpen(false);
  }

  return (
    <header className="site-header appbar">
      <Link className="brand" href="/" aria-label="Mittal AI Studio home">
        <Image
          className="brand-logo appbar-logo"
          src="/mittal-ai-studio-horizontal.svg"
          alt="Mittal AI Studio"
          width={260}
          height={72}
          priority
        />
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {primaryLinks.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        {firstName ? (
          <div className="account-menu">
            <button
              aria-expanded={accountOpen}
              aria-label="Open account menu"
              className="account-trigger"
              onClick={() => {
                setAccountOpen((open) => !open);
                setMenuOpen(false);
              }}
              type="button"
            >
              <span>Hi,</span>
              <strong>{displayName}</strong>
            </button>
            {accountOpen ? (
              <div className="account-popover">
                <span className="account-label">Signed in as {displayName}</span>
                <Link href="/dashboard" onClick={closeMenus}>
                  Dashboard
                </Link>
                {isAdmin ? (
                  <Link href="/admin" onClick={closeMenus}>
                    Admin Panel
                  </Link>
                ) : null}
                {!hasDashboard ? (
                  <Link href="/pricing" onClick={closeMenus}>
                    Buy Plan
                  </Link>
                ) : null}
                <LogoutButton />
              </div>
            ) : null}
          </div>
        ) : (
          <Link className="nav-cta" href="/login">
            Sign-in
          </Link>
        )}
        <Link className="nav-cta audit-cta" href="/contact">
          Enquire Now
        </Link>
        <button
          aria-expanded={menuOpen}
          aria-label="Open navigation menu"
          className="icon-button menu-button"
          onClick={() => {
            setMenuOpen((open) => !open);
            setAccountOpen(false);
          }}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      {menuOpen ? (
        <>
          <button className="drawer-backdrop" aria-label="Close navigation menu" onClick={closeMenus} type="button" />
          <aside className="nav-drawer" aria-label="Navigation drawer">
            <div className="drawer-heading">
              <strong>Explore Mittal AI Studio</strong>
              <span>Quick navigation</span>
            </div>
            <nav className="drawer-list" aria-label="More navigation">
              {secondaryLinks.map(([label, href]) => (
                <Link key={href} href={href} onClick={closeMenus}>
                  {label}
                </Link>
              ))}
              <a href={businessInfo.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </nav>
            <div className="drawer-heading account-heading">
              <strong>Account</strong>
              <span>Dashboard and access</span>
            </div>
            <nav className="drawer-list account-list" aria-label="Account navigation">
              {firstName ? (
                <>
                  <Link href="/dashboard" onClick={closeMenus}>
                    User Dashboard
                  </Link>
                  {isAdmin ? (
                    <Link href="/admin" onClick={closeMenus}>
                      Admin Panel
                    </Link>
                  ) : null}
                  <Link href="/pricing" onClick={closeMenus}>
                    Plans
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenus}>
                    Sign in
                  </Link>
                  <Link href="/signup" onClick={closeMenus}>
                    Create account
                  </Link>
                </>
              )}
            </nav>
          </aside>
        </>
      ) : null}
    </header>
  );
}
