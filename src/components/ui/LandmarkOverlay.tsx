"use client";

import { useMapStore } from "@/store/mapStore";
import { useLandmarkData } from "@/hooks/UseLandmarkData";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, MapPin, Map, Newspaper, CalendarDays, Clock } from "lucide-react";

export default function LandmarkOverlay() {
  const { activeLandmark, isOverlayOpen, closeOverlay } = useMapStore();
  const { landmark, events, news, loading } = useLandmarkData(activeLandmark);

  return (
    <AnimatePresence>
      {isOverlayOpen && (
        <>
          {/* Dramatic flash/ripple on open */}
          <motion.div
            initial={{ opacity: 0.6, scale: 0.95 }}
            animate={{ opacity: 0, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-white dark:bg-white pointer-events-none"
          />

          {/* Main overlay — slides up from bottom */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
          >
            {/* Fixed back bar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="fixed top-0 left-0 right-0 z-20 px-6 pt-6 pb-4 flex items-center justify-between"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
            >
              <Button
                onClick={closeOverlay}
                size="lg"
                className="gap-2 rounded-full"
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {landmark && (
                <Badge
                  variant="outline"
                  className="border-white/20 text-lg text-primary-foreground rounded-full px-3 py-1"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  {landmark.nepaliName}
                </Badge>
              )}
            </motion.div>

            {/* Hero image */}
            <div className="relative w-full shrink-0" style={{ height: "70vh" }}>
              {landmark ? (
                <Image
                  src={landmark.coverImage}
                  alt={landmark.name}
                  fill
                  className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted animate-pulse" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {landmark && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute bottom-0 left-0 right-0 px-8 pb-10"
                >
                  <p className="text-xs tracking-[0.25em] uppercase mb-2 text-white/50">
                    Najarpur · Terai
                  </p>
                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    {landmark.name}
                  </h1>
                </motion.div>
              )}
            </div>

            {/* Content sheet */}
            <div className="relative z-10 -mt-6 rounded-t-[2rem] bg-background shadow-2xl flex-1">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-2xl mx-auto px-6 pt-5 pb-28 space-y-10"
              >
                <div className="flex justify-center">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : landmark ? (
                  <>
                    {/* About */}
                    <section className="space-y-3">
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">About</p>
                      <p className="text-base md:text-lg leading-relaxed font-light text-foreground/80">
                        {landmark.description}
                      </p>
                    </section>

                    {/* Location */}
                    <section className="space-y-3">
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">Location</p>
                      <div className="flex flex-wrap gap-3">
                        <Card className="inline-flex border bg-muted/40">
                          <CardContent className="flex items-center gap-3 px-5 py-3">
                            <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="text-sm font-mono text-muted-foreground">
                              {landmark.lat.toFixed(6)}° N · {landmark.lng.toFixed(6)}° E
                            </span>
                          </CardContent>
                        </Card>
                        <Button asChild className="gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white">
                          <a
                            href={`https://www.google.com/maps?q=${landmark.lat},${landmark.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Map className="w-4 h-4" />
                            View in Maps
                          </a>
                        </Button>
                      </div>
                    </section>

                    <Separator />

                    {/* News */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-muted-foreground" />
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">Latest News</p>
                      </div>
                      {news.length > 0 ? (
                        <div className="space-y-3">
                          {news.map((item, i) => (
                            <motion.div
                              key={item._id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08 * i }}
                            >
                              <Card className="border bg-card hover:bg-muted/30 transition-colors duration-200">
                                <CardContent className="p-5 space-y-2.5">
                                  <Badge variant="secondary" className="capitalize text-xs">
                                    {item.category}
                                  </Badge>
                                  <CardTitle className="text-base font-semibold leading-snug">{item.title}</CardTitle>
                                  <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Card className="border border-dashed bg-muted/20">
                          <CardContent className="py-10 text-center">
                            <Newspaper className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No news yet. Check back soon.</p>
                          </CardContent>
                        </Card>
                      )}
                    </section>

                    <Separator />

                    {/* Events */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">Upcoming Events</p>
                      </div>
                      {events.length > 0 ? (
                        <div className="space-y-3">
                          {events.map((event, i) => (
                            <motion.div
                              key={event._id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08 * i }}
                            >
                              <Card className="border bg-card hover:bg-muted/30 transition-colors duration-200">
                                <CardContent className="p-5 space-y-2">
                                  <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-base font-semibold leading-snug">{event.title}</CardTitle>
                                    <Badge variant="outline" className="shrink-0 gap-1.5 text-xs">
                                      <Clock className="w-3 h-3" />
                                      {event.date}
                                    </Badge>
                                  </div>
                                  <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Card className="border border-dashed bg-muted/20">
                          <CardContent className="py-10 text-center">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No upcoming events.</p>
                          </CardContent>
                        </Card>
                      )}
                    </section>

                    <div className="text-center pt-4">
                      <p className="text-xs text-muted-foreground/50">Najarpur Village · Chandrapur, Rautahat, Nepal</p>
                    </div>
                  </>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}