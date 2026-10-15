"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { village } from "@/config/village";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, events: 0, landmarks: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/news").then(r => r.json()),
      fetch("/api/events").then(r => r.json()),
      fetch("/api/landmarks").then(r => r.json()),
    ]).then(([news, events, landmarks]) => {
      setStats({
        news: news.data?.length ?? 0,
        events: events.data?.length ?? 0,
        landmarks: landmarks.data?.length ?? 0,
      });
    });
  }, []);

  const statCards = [
    { label: "Landmarks", value: stats.landmarks, href: "/admin/landmarks" },
    { label: "News posts", value: stats.news, href: "/admin/news" },
    { label: "Events", value: stats.events, href: "/admin/events" },
  ];

  const actions = [
    { label: "Post news", href: "/admin/news/new", desc: "Announce festivals, updates, community news" },
    { label: "Add event", href: "/admin/events/new", desc: "Upcoming village events and ceremonies" },
    { label: "Add landmark", href: "/admin/landmarks/new", desc: "New location on the village map" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "4px" }}>
          {village.name}
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Village content dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(card => (
          <Link
            key={card.label}
            href={card.href}
            className="block rounded-lg p-5 transition-colors"
            style={{ background: "#0f0d0b", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,127,42,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
          >
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>{card.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginBottom: "10px", letterSpacing: "0.08em" }}>Quick actions</p>
        <div className="space-y-2">
          {actions.map(action => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-between rounded-lg px-5 py-4 transition-colors"
              style={{ background: "#0f0d0b", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,127,42,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{action.label}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{action.desc}</p>
              </div>
              <span style={{ color: "rgba(201,127,42,0.6)", fontSize: "18px" }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}