"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-green-400 animate-pulse text-sm tracking-widest">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 gap-6 shrink-0">
        <div>
          <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Admin Panel</p>
          <h1 className="text-xl font-bold">Kemlipur</h1>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/news", label: "News" },
            { href: "/admin/events", label: "Events" },
            { href: "/admin/landmarks", label: "Landmarks" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 rounded-lg text-sm transition ${
                pathname === item.href
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full text-left text-xs text-red-400 hover:text-red-300 transition px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}