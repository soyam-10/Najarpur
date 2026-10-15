"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { village } from "@/config/village";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect once status is resolved — never during "loading"
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [status, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  // Show nothing while session resolves — middleware already guards the route
  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-amber-700/40 border-t-amber-500 animate-spin" />
          <p className="text-amber-600/50 text-xs tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/news", label: "News" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/landmarks", label: "Landmarks" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/8 flex flex-col shrink-0" style={{ background: "#0f0d0b" }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/8">
          <p className="text-[10px] tracking-[0.2em] text-amber-600/60 mb-1 uppercase">Admin</p>
          <h1 className="text-base font-semibold text-white/90" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {village.name}
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && pathname !== "/admin";
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 rounded text-sm transition-colors"
                style={{
                  background: active ? "rgba(201,127,42,0.12)" : "transparent",
                  color: active ? "#C97F2A" : "rgba(255,255,255,0.45)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/8 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            ← View site
          </Link>
          <div className="px-3 py-1">
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
              {session.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full text-left px-3 py-2 rounded text-xs transition-colors"
            style={{ color: "rgba(239,68,68,0.6)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(239,68,68,0.9)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(239,68,68,0.6)")}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto" style={{ background: "#0c0a09" }}>
        <div className="max-w-3xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}