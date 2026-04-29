import Link from "next/link";

export function UpgradeNotice() {
  return (
    <div className="data-card">
      <h2>Upgrade required</h2>
      <p>This section is available after buying a yearly plan. You can still update your profile and password from the basic dashboard.</p>
      <Link className="button primary" href="/pricing">
        View Plans
      </Link>
    </div>
  );
}
