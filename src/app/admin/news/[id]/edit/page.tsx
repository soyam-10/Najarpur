"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Landmark, NewsItem } from "@/types";

export default function EditNews() {
    const router = useRouter();
    const { id } = useParams();
    const [form, setForm] = useState<Partial<NewsItem>>({});
    const [loading, setLoading] = useState(false);
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);

    useEffect(() => {
        fetch("/api/landmarks")
            .then((r) => r.json())
            .then((data) => { if (data.success) setLandmarks(data.data); });
    }, []);

    useEffect(() => {
        fetch("/api/news").then((r) => r.json()).then((data) => {
            const item = data.data?.find((n: NewsItem) => n._id === id);
            if (item) setForm(item);
        });
    }, [id]);

    const handleSave = async () => {
        setLoading(true);
        await fetch(`/api/news/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        router.push("/admin/news");
        setLoading(false);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold">Edit News</h2>
            <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Title</label>
                    <input
                        type="text"
                        value={form.title || ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Body</label>
                    <textarea
                        rows={5}
                        value={form.body || ""}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Category</label>
                        <select
                            value={form.category || "general"}
                            onChange={(e) => setForm({ ...form, category: e.target.value as NewsItem["category"] })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                        >
                            {["general", "festival", "event", "announcement"].map((c) => (
                                <option key={c} value={c} className="bg-black">{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Landmark</label>
                        <select
                            value={form.landmark || ""}
                            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                        >
                            <option value="" className="bg-black">None</option>
                            {landmarks.map((l) => (
                                <option key={l._id} value={l._id} className="bg-black">{l.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 transition rounded-lg py-3 font-medium text-sm"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}