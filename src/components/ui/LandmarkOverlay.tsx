"use client";

import { useMapStore } from "@/store/mapStore";
import { useLandmarkData } from "@/hooks/UseLandmarkData";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Map, Newspaper, CalendarDays } from "lucide-react";
import { village } from "@/config/village";

// ── small helpers ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-5 h-px"
        style={{ background: "var(--village-accent, #C97F2A)" }}
      />
      <span
        style={{
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--village-accent, #C97F2A)",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function SkeletonBlock({ h = "h-20" }: { h?: string }) {
  return (
    <div
      className={`${h} rounded w-full animate-pulse`}
      style={{ background: "var(--muted)" }}
    />
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function LandmarkOverlay() {
  const { activeLandmark, isOverlayOpen, closeOverlay } = useMapStore();
  const { landmark, events, news, loading } = useLandmarkData(activeLandmark);

  return (
    <AnimatePresence>
      {isOverlayOpen && (
        <>
          {/* Warm flash on open — like a lamp being lit */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ background: "var(--village-accent, #C97F2A)" }}
          />

          {/* Main overlay */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 overlay-scroll"
            style={{
              background: "var(--background)",
              overflowY: "auto",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {/* ── Layout: side-by-side on md+, stacked on mobile ── */}
            <div className="md:flex md:min-h-screen md:overflow-hidden">
              {/* ── Left: fixed-position hero image ── */}
              <div
                className="relative w-full shrink-0 md:w-1/2 md:sticky md:top-0 md:self-start md:h-screen"
                style={{ height: "55vw", maxHeight: "100vh", minHeight: "260px" }}
              >
                {/* Image */}
                {landmark ? (
                  <Image
                    src={landmark.coverImage}
                    alt={landmark.name}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full animate-pulse" style={{ background: "var(--muted)" }} />
                )}

                {/* Gradient over image */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(15,8,0,0.88) 0%, rgba(15,8,0,0.2) 55%, rgba(15,8,0,0.55) 100%)",
                  }}
                />

                {/* Back button — top left */}
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={closeOverlay}
                  aria-label="Go back"
                  className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                  style={{
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    background: "rgba(15,8,0,0.5)",
                    border: "1px solid rgba(245,236,215,0.15)",
                    color: "rgba(245,236,215,0.85)",
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  Back
                </motion.button>

                {/* Village badge — top right */}
                {landmark && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="absolute top-5 right-5 z-20"
                  >
                    <span
                      className="text-sm"
                      style={{
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        background: "rgba(15,8,0,0.5)",
                        border: "1px solid rgba(245,236,215,0.15)",
                        borderRadius: "100px",
                        padding: "5px 14px",
                        color: "rgba(245,236,215,0.7)",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "block",
                      }}
                    >
                      {landmark.nepaliName}
                    </span>
                  </motion.div>
                )}

                {/* Landmark name over image — bottom */}
                {landmark && (
                  <motion.div
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute bottom-0 left-0 right-0 px-7 pb-8"
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(245,236,215,0.45)",
                        fontFamily: "'DM Sans', sans-serif",
                        marginBottom: "6px",
                      }}
                    >
                      {village.name} · {village.locationShort}
                    </p>
                    <h1
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                        fontWeight: 600,
                        lineHeight: 1.15,
                        color: "#F5ECD7",
                        letterSpacing: "-0.02em",
                        textShadow: "0 2px 24px rgba(0,0,0,0.7)",
                        margin: 0,
                      }}
                    >
                      {landmark.name}
                    </h1>
                  </motion.div>
                )}
              </div>

              {/* ── Right: scrollable content ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex-1 md:min-h-screen"
                style={{
                  background: "var(--background)",
                  padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 5vw, 3.5rem)",
                  paddingBottom: "5rem",
                  width: "50%",
                  overflowY: "auto",
                  maxHeight: "100vh",
                  position: "sticky",
                  top: 0,
                }}
              >
                {/* Drag pill — mobile only */}
                <div className="md:hidden flex justify-center mb-6 -mt-2">
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ background: "var(--border)" }}
                  />
                </div>

                {loading ? (
                  <div className="space-y-5 mt-4">
                    <SkeletonBlock h="h-6" />
                    <SkeletonBlock h="h-32" />
                    <SkeletonBlock h="h-24" />
                  </div>
                ) : landmark ? (
                  <div className="space-y-10">

                    {/* About */}
                    <section>
                      <SectionLabel>About</SectionLabel>
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                          lineHeight: 1.8,
                          color: "var(--foreground)",
                          opacity: 0.85,
                          fontWeight: 400,
                        }}
                      >
                        {landmark.description}
                      </p>
                    </section>

                    {/* Location */}
                    {landmark.lat != null && landmark.lng != null && (
                      <section>
                        <SectionLabel>Location</SectionLabel>
                        <div className="flex flex-wrap gap-3 items-center">
                          <div
                            className="flex items-center gap-2 px-4 py-2.5 rounded"
                            style={{
                              background: "var(--muted)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <MapPin
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: "var(--village-accent, #C97F2A)" }}
                            />
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: "12px",
                                color: "var(--muted-foreground)",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {landmark.lat.toFixed(6)}° N · {landmark.lng.toFixed(6)}° E
                            </span>
                          </div>

                          <a
                            href={`https://www.google.com/maps?q=${landmark.lat},${landmark.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded transition-opacity hover:opacity-80"
                            style={{
                              background: "var(--village-accent, #C97F2A)",
                              color: "#0F0800",
                              fontSize: "13px",
                              fontWeight: 500,
                              textDecoration: "none",
                            }}
                          >
                            <Map className="w-3.5 h-3.5" />
                            Open in Maps
                          </a>
                        </div>
                      </section>
                    )}

                    {/* Rule */}
                    <div
                      className="w-full h-px"
                      style={{ background: "var(--border)" }}
                    />

                    {/* News */}
                    <section>
                      <SectionLabel>
                        <span className="flex items-center gap-2">
                          <Newspaper className="w-3 h-3" />
                          Latest News
                        </span>
                      </SectionLabel>

                      {news.length > 0 ? (
                        <div className="space-y-4">
                          {news.map((item) => (
                            <div
                              key={item._id}
                              className="rounded p-4 transition-colors"
                              style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                              }}
                            >
                              <span
                                className="inline-block mb-2 px-2.5 py-0.5 rounded-full text-[10px] tracking-wider capitalize"
                                style={{
                                  background: "var(--village-accent-muted, rgba(201,127,42,0.15))",
                                  color: "var(--village-accent, #C97F2A)",
                                  fontFamily: "'DM Sans', sans-serif",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                }}
                              >
                                {item.category}
                              </span>
                              <h4
                                style={{
                                  fontFamily: "'Playfair Display', Georgia, serif",
                                  fontSize: "15px",
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                  color: "var(--foreground)",
                                  marginBottom: "6px",
                                }}
                              >
                                {item.title}
                              </h4>
                              <p
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.7,
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {item.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--muted-foreground)",
                            fontStyle: "italic",
                          }}
                        >
                          No news yet. Check back soon.
                        </p>
                      )}
                    </section>

                    {/* Rule */}
                    <div
                      className="w-full h-px"
                      style={{ background: "var(--border)" }}
                    />

                    {/* Events */}
                    <section>
                      <SectionLabel>
                        <span className="flex items-center gap-2">
                          <CalendarDays className="w-3 h-3" />
                          Upcoming Events
                        </span>
                      </SectionLabel>

                      {events.length > 0 ? (
                        <div className="space-y-4">
                          {events.map((event) => (
                            <div
                              key={event._id}
                              className="rounded p-4 transition-colors"
                              style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                              }}
                            >
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h4
                                  style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                    color: "var(--foreground)",
                                  }}
                                >
                                  {event.title}
                                </h4>
                                <span
                                  className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] whitespace-nowrap"
                                  style={{
                                    border: "1px solid var(--border)",
                                    color: "var(--muted-foreground)",
                                    fontFamily: "'DM Sans', sans-serif",
                                  }}
                                >
                                  {event.date}
                                </span>
                              </div>
                              <p
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.7,
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {event.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--muted-foreground)",
                            fontStyle: "italic",
                          }}
                        >
                          No upcoming events.
                        </p>
                      )}
                    </section>

                    {/* Footer credit */}
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        opacity: 0.45,
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {village.footerAttribution}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
