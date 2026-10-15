"use client";

import { Landmark } from "@/types";
import { useMapStore } from "@/store/mapStore";
import Image from "next/image";

interface Props {
  landmark: Landmark;
}

/**
 * Film-still card — 16:9, full-bleed photo, name in Playfair at bottom.
 * No content box below the image. No card shadow soup.
 * Click zooms the 3D map to the landmark and opens the overlay.
 * Scroll to the 3D map section first so the animation is visible.
 */
export default function LandmarkCard({ landmark }: Props) {
  const { setActiveLandmark } = useMapStore();

  const handleClick = () => {
    // Scroll to map so the zoom animation is visible
    const hero = document.getElementById("map-hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
      // Small delay so the user sees the map before the zoom fires
      setTimeout(() => setActiveLandmark(landmark._id!), 600);
    } else {
      setActiveLandmark(landmark._id!);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group relative block w-full text-left focus-visible:outline-none"
      style={{ borderRadius: "6px", overflow: "hidden" }}
      aria-label={`Explore ${landmark.name}`}
    >
      {/* 16:9 image container */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <Image
          src={landmark.coverImage}
          alt={landmark.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Base gradient — always dark at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(15,8,0,0.92) 0%, rgba(15,8,0,0.3) 50%, rgba(15,8,0,0.08) 100%)",
          }}
        />

        {/* Hover overlay — warms and brightens slightly */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(to top, rgba(180,90,20,0.25) 0%, transparent 60%)",
          }}
        />

        {/* Nepali name — top right, subtle */}
        <span
          className="absolute top-3 right-3 text-[10px] tracking-wider"
          style={{
            color: "rgba(245,236,215,0.55)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {landmark.nepaliName}
        </span>

        {/* Landmark name — bottom, Playfair */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h3
            className="font-display text-lg leading-snug text-white"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {landmark.name}
          </h3>

          {/* "View" indicator — appears on hover */}
          <div
            className="flex items-center gap-2 mt-1.5 transition-all duration-400 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
          >
            <div
              className="h-px w-5 transition-all duration-500 group-hover:w-8"
              style={{ background: "var(--village-accent, #C97F2A)" }}
            />
            <span
              className="text-[11px] tracking-wider"
              style={{
                color: "var(--village-accent, #C97F2A)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Explore
            </span>
          </div>
        </div>
      </div>

      {/* Focus ring */}
      <div
        className="absolute inset-0 opacity-0 group-focus-visible:opacity-100 pointer-events-none transition-opacity"
        style={{
          boxShadow: "inset 0 0 0 2px var(--village-accent, #C97F2A)",
          borderRadius: "6px",
        }}
      />
    </button>
  );
}
