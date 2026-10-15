"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Landmark } from "@/types";
import LandmarkCard from "@/components/ui/LandmarkCard";
import LandmarkOverlay from "@/components/ui/LandmarkOverlay";
import { motion } from "framer-motion";
import { village } from "@/config/village";

const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-screen flex items-center justify-center map-hero"
      aria-label={`Loading ${village.loadingLabel}`}
    >
      <div className="text-center">
        <div
          className="w-6 h-6 rounded-full mx-auto mb-5"
          style={{
            border: `1.5px solid ${village.accentColor}44`,
            borderTopColor: village.accentColor,
            animation: "spin 1s linear infinite",
          }}
        />
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: `${village.accentColor}80`,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {village.loadingLabel}
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

// ── Single orchestrated entrance — fires once on load ──────────────────────
const ENTRANCE = {
  location: { opacity: 0, y: -8 },
  title: { opacity: 0, y: -6 },
  rule: { scaleX: 0 },
  tagline: { opacity: 0 },
  hint: { opacity: 0, y: 12 },
};

export default function Home() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const landmarksRef = useRef<HTMLElement>(null);

  // Apply village accent CSS var on mount
  useEffect(() => {
    document.documentElement.style.setProperty("--village-accent", village.accentColor);
    document.documentElement.style.setProperty(
      "--village-accent-muted",
      `${village.accentColor}26`
    );
    document.documentElement.style.setProperty(
      "--village-accent-glow",
      `${village.accentColor}66`
    );
  }, []);

  useEffect(() => {
    fetch("/api/landmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLandmarks(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Grain layer — very subtle film texture */}
      <div className="grain" aria-hidden="true" />

      <LandmarkOverlay />

      {/* ── 3D Map Hero — always dark ── */}
      <section id="map-hero" className="relative w-full h-screen map-hero overflow-hidden">
        <MapCanvas />

        {/* Top vignette */}
        <div
          className="absolute inset-x-0 top-0 h-36 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom, rgba(15,8,0,0.7) 0%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, rgba(15,8,0,1) 0%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* ── Hero title — single orchestrated entrance ── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-10 pointer-events-none">
          <motion.p
            initial={ENTRANCE.location}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(245,236,215,0.38)",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: "10px",
            }}
          >
            {village.location}
          </motion.p>

          <motion.h1
            initial={ENTRANCE.title}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(3.2rem, 9vw, 7rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              color: "#F5ECD7",
              textAlign: "center",
              textShadow: "0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            {village.name}
          </motion.h1>

          {/* Accent rule under title */}
          <motion.div
            initial={ENTRANCE.rule}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.95, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              height: "1px",
              width: "3rem",
              background: `linear-gradient(to right, transparent, ${village.accentColor}, transparent)`,
              marginTop: "14px",
              transformOrigin: "center",
            }}
          />

          <motion.p
            initial={ENTRANCE.tagline}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
              color: "rgba(245,236,215,0.42)",
              marginTop: "12px",
              letterSpacing: "0.01em",
              textAlign: "center",
            }}
          >
            {village.tagline}
          </motion.p>
        </div>

        {/* ── Bottom hint ── */}
        <motion.div
          initial={ENTRANCE.hint}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 z-20 flex flex-col items-center gap-4"
          style={{ transform: "translateX(-50%)" }}
        >
          <span
            className="px-4 py-2 rounded-full"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "rgba(15,8,0,0.5)",
              border: "1px solid rgba(245,236,215,0.1)",
              color: "rgba(245,236,215,0.45)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Click a flame to explore
          </span>

          <button
            onClick={() => landmarksRef.current?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll to landmarks"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(245,236,215,0.25)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Scroll
            </span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={village.accentColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              style={{ opacity: 0.55 }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </button>
        </motion.div>
      </section>

      {/* ── Transition ── */}
      <div
        style={{
          height: "64px",
          background: "linear-gradient(to bottom, #0F0800, var(--background))",
        }}
        aria-hidden="true"
      />

      {/* ── Landmarks section ── */}
      <section
        ref={landmarksRef}
        id="landmarks"
        style={{ background: "var(--background)", paddingTop: "4rem", paddingBottom: "6rem" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2.5rem)" }}>

          {/* Section header — no eyebrow label, just editorial heading */}
          <div style={{ marginBottom: "3rem", maxWidth: "480px" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                color: "var(--foreground)",
                marginBottom: "14px",
              }}
            >
              Places that shape {village.name}
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "var(--muted-foreground)",
                fontWeight: 300,
              }}
            >
              Every corner of {village.name} holds a story. These are the places
              where village life is lived.
            </p>
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
              gap: "1.25rem",
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded"
                    style={{
                      aspectRatio: "16/9",
                      background: "var(--muted)",
                    }}
                  />
                ))
              : landmarks.map((landmark) => (
                  <LandmarkCard key={landmark._id} landmark={landmark} />
                ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2.5rem clamp(1rem, 4vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: "var(--background)",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "var(--muted-foreground)",
            opacity: 0.6,
          }}
        >
          {village.name} · {village.location}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: "var(--muted-foreground)",
            opacity: 0.6,
          }}
        >
          Built by{" "}
          <a
            href="https://soyambajgain.com.np"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: village.accentColor,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Heisenberg
          </a>
          . Preserving village stories.
        </p>
      </footer>
    </main>
  );
}
