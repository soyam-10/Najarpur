"use client";

import { Landmark } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  landmark: Landmark;
}

export default function LandmarkCard({ landmark }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/landmarks/${landmark._id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden relative bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/7 transition-all duration-400"
      style={{ transition: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-green-50 dark:bg-green-950/20">
        <Image
          src={landmark.coverImage}
          alt={landmark.name}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span
          className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full text-white/80"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {landmark.nepaliName}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        <h3
          className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300"
          style={{ letterSpacing: "-0.01em" }}
        >
          {landmark.name}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2 text-gray-400 dark:text-white/40">
          {landmark.description}
        </p>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-xs text-green-600/70 dark:text-green-400/70 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            Explore
          </span>
          <span className="text-xs text-green-600/70 dark:text-green-400/70 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  );
}