"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark } from "@/types";

export default function NewNews() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        body: "",
        category: "general",
        landmark: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);
    useEffect(() => {
        fetch("/api/landmarks")
            .then((r) => r.json())
            .then((data) => { if (data.success) setLandmarks(data.data); });
    }, []);

    const handleSubmit = async () => {
        if (!form.title || !form.body) {
            setError("Title and body are required.");
            return;
        }
        setLoading(true);
        const payload = { ...form, landmark: form.landmark || undefined };
        const res = await fetch("/api/news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
            router.push("/admin/news");
        } else {
            setError("Failed to post news.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold">Post News</h2>

            {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                {[
                    { label: "Title", key: "title", type: "text", placeholder: "News title" },
                ].map((field) => (
                    <div key={field.key} className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">{field.label}</label>
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={form[field.key as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        />
                    </div>
                ))}

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Body</label>
                    <textarea
                        rows={5}
                        placeholder="Write the news content..."
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                        >
                            {["general", "festival", "event", "announcement"].map((c) => (
                                <option key={c} value={c} className="bg-black">{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Landmark (optional)</label>
                        <select
                            value={form.landmark}
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
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 transition rounded-lg py-3 font-medium text-sm"
                >
                    {loading ? "Posting..." : "Post News"}
                </button>
            </div>
        </div>
    );
}