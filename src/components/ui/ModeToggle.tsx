"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Dark/light toggle — minimal, warm aesthetic.
 * Uses a sun/moon icon in a small pill, not a generic floating circle.
 * Positioned top-right to not conflict with landmark back button (bottom-right).
 */
export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-5 right-5 z-50 flex items-center gap-1.5 px-3 py-1.5 transition-all duration-300 hover:opacity-80 active:scale-95"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: isDark ? "rgba(245,236,215,0.08)" : "rgba(15,8,0,0.06)",
        border: isDark
          ? "1px solid rgba(245,236,215,0.12)"
          : "1px solid rgba(15,8,0,0.1)",
        borderRadius: "100px",
        cursor: "pointer",
      }}
    >
      {isDark ? (
        // Sun
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(245,236,215,0.7)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="rgba(15,8,0,0.5)"
          stroke="none"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      <span
        style={{
          fontSize: "11px",
          fontFamily: "'DM Sans', sans-serif",
          color: isDark ? "rgba(245,236,215,0.55)" : "rgba(15,8,0,0.45)",
          letterSpacing: "0.03em",
        }}
      >
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
