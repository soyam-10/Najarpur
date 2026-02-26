"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Landmark, Event, NewsItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft, MapPin, Map, Newspaper,
    CalendarDays, Clock, Box
} from "lucide-react";

const LandmarkModelViewer = dynamic(
    () => import("@/components/map/LandmarkModelViewer"),
    { ssr: false }
);

export default function LandmarkPage() {
    const { id } = useParams();
    const router = useRouter();
    const [landmark, setLandmark] = useState<Landmark | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modelOpen, setModelOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            fetch(`/api/landmarks/${id}`).then((r) => r.json()),
            fetch(`/api/events?landmark=${id}`).then((r) => r.json()),
            fetch(`/api/news?landmark=${id}`).then((r) => r.json()),
        ]).then(([l, e, n]) => {
            if (l.success) setLandmark(l.data);
            if (e.success) setEvents(e.data);
            if (n.success) setNews(n.data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Skeleton className="w-full h-[55vw] min-h-[280px] max-h-[70vh]" />
                <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-28 w-full rounded-2xl" />
                    <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!landmark) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="p-8 text-center space-y-4 w-full max-w-sm">
                    <CardTitle className="text-lg">Landmark not found</CardTitle>
                    <p className="text-muted-foreground text-sm">
                        This landmark doesn&apos;t exist or may have been removed.
                    </p>
                    <Button onClick={() => router.push("/")} variant="outline" className="gap-2 w-full">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Village
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <main
            className="min-h-screen bg-background text-foreground"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
        >
            {/* 3D viewer modal */}
            {landmark.modelPath && (
                <LandmarkModelViewer
                    modelPath={landmark.modelPath}
                    landmarkName={landmark.name}
                    open={modelOpen}
                    onClose={() => setModelOpen(false)}
                />
            )}

            {/* Fixed top bar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="fixed top-0 left-0 right-0 z-20 px-4 pt-10 pb-4 md:px-6 md:pt-6 flex items-center justify-between"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
                }}
            >
                <Button
                    onClick={() => router.push("/")}
                    size="sm"
                    className="gap-1.5 rounded-full text-white hover:text-white h-9 px-4"
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

                <Badge
                    variant="outline"
                    className="text-white/70 border-white/20 rounded-full px-3 py-1 text-xs max-w-[45vw] truncate"
                    style={{
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        background: "rgba(255,255,255,0.1)",
                    }}
                >
                    {landmark.nepaliName}
                </Badge>
            </motion.div>

            {/* Hero */}
            <div className="relative w-full" style={{ height: "70vh", minHeight: 300 }}>
                <Image
                    src={landmark.coverImage}
                    alt={landmark.name}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

                {/* View in 3D button */}
                {landmark.modelPath && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <button
                            onClick={() => setModelOpen(true)}
                            className="flex flex-col items-center gap-3 group active:scale-95 transition-transform"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping" />
                                <div
                                    className="relative w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{
                                        backdropFilter: "blur(20px)",
                                        WebkitBackdropFilter: "blur(20px)",
                                        background: "rgba(255,215,0,0.15)",
                                        border: "1px solid rgba(255,215,0,0.4)",
                                        boxShadow: "0 0 30px rgba(255,215,0,0.25)",
                                    }}
                                >
                                    <Box className="w-7 h-7 text-yellow-400" />
                                </div>
                            </div>
                            <span
                                className="text-xs tracking-[0.15em] uppercase px-4 py-1.5 rounded-full text-white/80"
                                style={{
                                    backdropFilter: "blur(12px)",
                                    background: "rgba(0,0,0,0.45)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                }}
                            >
                                View in 3D
                            </span>
                        </button>
                    </motion.div>
                )}

                {/* Title */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-8 md:pb-10"
                >
                    <p className="text-xs tracking-[0.2em] uppercase mb-1.5 text-white/50">
                        Najarpur · Terai · Nepal
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                        {landmark.name}
                    </h1>
                </motion.div>
            </div>

            {/* Content sheet */}
            <div className="relative z-10 -mt-6 rounded-t-[2rem] bg-background shadow-2xl">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-24 space-y-8"
                >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-1">
                        <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                    </div>

                    {/* About */}
                    <section className="space-y-3">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                            About
                        </p>
                        <p className="text-base leading-relaxed font-light text-foreground/80">
                            {landmark.description}
                        </p>
                    </section>

                    {/* Location */}
                    <section className="space-y-3">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                            Location
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Card className="border bg-muted/40 w-full sm:w-auto">
                                <CardContent className="flex items-center gap-3 px-4 py-3">
                                    <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                                    <span className="text-xs sm:text-sm font-mono text-muted-foreground">
                                        {landmark.lat.toFixed(6)}° N · {landmark.lng.toFixed(6)}° E
                                    </span>
                                </CardContent>
                            </Card>
                            <Button
                                asChild
                                className="gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white w-full sm:w-auto"
                            >
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
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                                Latest News
                            </p>
                        </div>
                        {news.length > 0 ? (
                            <div className="space-y-3">
                                {news.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.06 * i }}
                                    >
                                        <Card className="border bg-card hover:bg-muted/30 transition-colors">
                                            <CardContent className="p-4 sm:p-5 space-y-2">
                                                <Badge variant="secondary" className="capitalize text-xs">
                                                    {item.category}
                                                </Badge>
                                                <CardTitle className="text-sm sm:text-base font-semibold leading-snug">
                                                    {item.title}
                                                </CardTitle>
                                                <p className="text-sm leading-relaxed text-muted-foreground">
                                                    {item.body}
                                                </p>
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
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                                Upcoming Events
                            </p>
                        </div>
                        {events.length > 0 ? (
                            <div className="space-y-3">
                                {events.map((event, i) => (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.06 * i }}
                                    >
                                        <Card className="border bg-card hover:bg-muted/30 transition-colors">
                                            <CardContent className="p-4 sm:p-5 space-y-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <CardTitle className="text-sm sm:text-base font-semibold leading-snug">
                                                        {event.title}
                                                    </CardTitle>
                                                    <Badge
                                                        variant="outline"
                                                        className="shrink-0 gap-1 text-xs whitespace-nowrap"
                                                    >
                                                        <Clock className="w-3 h-3" />
                                                        {event.date}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm leading-relaxed text-muted-foreground">
                                                    {event.description}
                                                </p>
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
                        <p className="text-xs text-muted-foreground/40">
                            Najarpur Village · Terai, Nepal
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}