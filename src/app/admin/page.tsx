"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, events: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/news").then((r) => r.json()),
      fetch("/api/events").then((r) => r.json()),
    ]).then(([news, events]) => {
      setStats({
        news: news.data?.length ?? 0,
        events: events.data?.length ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: "Total News", value: stats.news, href: "/admin/news", color: "green" },
    { label: "Total Events", value: stats.events, href: "/admin/events", color: "blue" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Manage Kemlipur content below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white/5 border border-white/10 hover:border-green-500/40 rounded-2xl p-6 transition group"
          >
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-4xl font-bold mt-2 group-hover:text-green-400 transition">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Post News", href: "/admin/news/new", desc: "Announce festivals, events, updates" },
          { label: "Post Event", href: "/admin/events/new", desc: "Add upcoming village events" },
          { label: "Manage Landmarks", href: "/admin/landmarks", desc: "Edit landmark descriptions" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white/5 border border-white/10 hover:border-green-500/40 rounded-2xl p-5 transition"
          >
            <p className="font-semibold text-green-400">{action.label} →</p>
            <p className="text-gray-500 text-sm mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}