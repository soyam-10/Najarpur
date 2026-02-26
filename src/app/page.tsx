"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Landmark } from "@/types";
import LandmarkCard from "@/components/ui/LandmarkCard";
import LandmarkOverlay from "@/components/ui/LandmarkOverlay";
import { motion, useInView } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto" />
        <p className="text-green-400/60 tracking-widest text-xs uppercase">Loading Najarpur</p>
      </div>
    </div>
  ),
});

function LandmarkCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function LandmarkCardAnimated({ landmark, index }: { landmark: Landmark; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <LandmarkCard landmark={landmark} />
    </motion.div>
  );
}

export default function Home() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const landmarksRef = useRef(null);
  const landmarksTitleInView = useInView(landmarksRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/landmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLandmarks(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <main
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
    >
      <LandmarkOverlay />

      {/* 3D Map Hero — always dark */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        <MapCanvas />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
            mixBlendMode: "overlay",
          }}
        />

        {/* Vignettes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/60 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent pointer-events-none z-10" />

        {/* Title */}
        <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-10 pointer-events-none">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs tracking-[0.35em] uppercase mb-2 text-white/40"
          >
            Chandrapur · Rautahat · Nepal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}
          >
            Najarpur
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-3 h-px w-16 bg-green-400/60"
          />
        </div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        >
          <Badge
            variant="outline"
            className="text-white/50 border-white/10 rounded-full px-4 py-1.5 text-xs tracking-[0.2em] uppercase"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.07)",
            }}
          >
            Click a marker to explore
          </Badge>
          <button
            onClick={() => document.getElementById("landmarks")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-1 group pointer-events-auto"
          >
            <span className="text-xs tracking-widest uppercase text-white/30">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-green-400/50 group-hover:text-green-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* Transition strip */}
      <div className="h-16 bg-linear-to-b from-black to-background" />

      {/* Landmarks section */}
      <section id="landmarks" className="relative bg-background transition-colors duration-300">
        <div ref={landmarksRef} className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={landmarksTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-3"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-green-600 dark:text-green-400/70 font-medium">
              Discover
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
              style={{ letterSpacing: "-0.02em" }}
            >
              Landmarks
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-md">
              Every corner of Najarpur tells a story. Explore them all.
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={landmarksTitleInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 h-px w-24 bg-linear-to-r from-green-500/60 dark:from-green-400/60 to-transparent"
          />
        </div>

        {/* Cards grid */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <LandmarkCardSkeleton key={i} />)
              : landmarks.map((landmark, i) => (
                <LandmarkCardAnimated key={landmark._id} landmark={landmark} index={i} />
              ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Footer */}
      <footer className="py-10 px-6 text-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <p className="text-sm text-muted-foreground">
            Designed & built by{" "}
            <a
              href="https://soyambajgain.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors font-medium"
            >
              Heisenberg
            </a>
          </p>
          <p className="text-xs text-muted-foreground/50">
            Preserving village stories, one landmark at a time.
          </p>
        </motion.div>
      </footer>
    </main>
  );
}