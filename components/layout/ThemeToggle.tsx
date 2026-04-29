"use client";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("mittal-theme", theme);
}

export function ThemeToggle() {
  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  }

  return (
    <button
      aria-label="Toggle light and dark mode"
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      type="button"
      title="Toggle light and dark mode"
    >
      <svg aria-hidden="true" className="theme-icon sun-icon" viewBox="0 0 24 24">
        <path d="M12 4V2M12 22v-2M4.93 4.93 3.52 3.52M20.48 20.48l-1.41-1.41M4 12H2M22 12h-2M4.93 19.07l-1.41 1.41M20.48 3.52l-1.41 1.41" />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <svg aria-hidden="true" className="theme-icon moon-icon" viewBox="0 0 24 24">
        <path d="M21 12.79A8.5 8.5 0 1 1 11.21 3 6.8 6.8 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
