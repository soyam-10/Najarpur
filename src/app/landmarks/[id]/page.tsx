"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Landmark, Event, NewsItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, MapPin, Map, Newspaper, CalendarDays, Clock } from "lucide-react";

export default function LandmarkPage() {
    const { id } = useParams();
    const router = useRouter();
    const [landmark, setLandmark] = useState<Landmark | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

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
                {/* Hero skeleton */}
                <Skeleton className="w-full h-[70vh]" />
                <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!landmark) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center space-y-4 max-w-sm w-full">
                    <CardTitle className="text-lg">Landmark not found</CardTitle>
                    <p className="text-muted-foreground text-sm">This landmark doesn&apos;t exist or may have been removed.</p>
                    <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Village
                    </Button>
                </Card>
            </div>
        );
    }

    const categoryVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        festival: "default",
        event: "secondary",
        announcement: "outline",
        general: "secondary",
    };

    return (
        <main
            className="min-h-screen bg-background text-foreground"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
        >
            {/* Fixed back bar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="fixed top-0 left-0 right-0 z-20 px-6 pt-6 pb-4 flex items-center justify-between"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
            >
                <Button
                    onClick={router.back}
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
                    </Badge>)}
            </motion.div>

            {/* Hero image */}
            <div className="relative w-full" style={{ height: "70vh" }}>
                <Image
                    src={landmark.coverImage}
                    alt={landmark.name}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute bottom-0 left-0 right-0 px-8 pb-10"
                >
                    <p className="text-xs tracking-[0.25em] uppercase mb-2 text-white/50">
                        Najarpur · Terai
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                        {landmark.name}
                    </h1>
                </motion.div>
            </div>

            {/* Content sheet */}
            <div className="relative z-10 -mt-6 rounded-t-[2rem] bg-background shadow-2xl">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-w-2xl mx-auto px-6 pt-5 pb-28 space-y-10"
                >
                    {/* Drag handle */}
                    <div className="flex justify-center">
                        <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                    </div>

                    {/* About */}
                    <section className="space-y-3">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                            About
                        </p>
                        <p className="text-base md:text-lg leading-relaxed font-light text-foreground/80">
                            {landmark.description}
                        </p>
                    </section>

                    {/* Location */}
                    <section className="space-y-3">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                            Location
                        </p>
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
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                                Latest News
                            </p>
                        </div>

                        {news.length > 0 ? (
                            <div className="space-y-3">
                                {news.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 * i }}
                                    >
                                        <Card className="border bg-card hover:bg-muted/30 transition-colors duration-200">
                                            <CardContent className="p-5 space-y-2.5">
                                                <Badge
                                                    variant={categoryVariant[item.category] ?? "secondary"}
                                                    className="capitalize text-xs"
                                                >
                                                    {item.category}
                                                </Badge>
                                                <CardTitle className="text-base font-semibold leading-snug">
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 * i }}
                                    >
                                        <Card className="border bg-card hover:bg-muted/30 transition-colors duration-200">
                                            <CardContent className="p-5 space-y-2">
                                                <div className="flex items-start justify-between gap-4">
                                                    <CardTitle className="text-base font-semibold leading-snug">
                                                        {event.title}
                                                    </CardTitle>
                                                    <Badge variant="outline" className="shrink-0 gap-1.5 text-xs">
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

                    {/* Footer */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-muted-foreground/50">
                            Najarpur Village · Rautahat, Chandrapur, Nepal
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}