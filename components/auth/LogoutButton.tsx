"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <button className="link-button" onClick={logout} type="button">
      Logout
    </button>
  );
}
