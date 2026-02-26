"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark } from "@/types";
import { geoToPlane } from "@/lib/geoUtils";

export default function NewLandmark() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        nepaliName: "",
        description: "",
        lat: "",
        lng: "",
        coverImage: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!form.name || !form.nepaliName || !form.description || !form.lat || !form.lng) {
            setError("All fields except cover image are required.");
            return;
        }
        setLoading(true);
        const position = geoToPlane(parseFloat(form.lat), parseFloat(form.lng));
        const payload = {
            name: form.name,
            nepaliName: form.nepaliName,
            description: form.description,
            position,
            coverImage: form.coverImage,
        };
        const res = await fetch("/api/landmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
            router.push("/admin/landmarks");
        } else {
            setError("Failed to create landmark.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold">Add Landmark</h2>

            {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                {[
                    { label: "ID (slug)", key: "id", placeholder: "e.g. new-landmark" },
                    { label: "English Name", key: "name", placeholder: "Landmark name" },
                    { label: "Nepali Name", key: "nepaliName", placeholder: "नेपाली नाम" },
                    { label: "Cover Image Path", key: "coverImage", placeholder: "/images/landmarks/name.jpg" },
                ].map((field) => (
                    <div key={field.key} className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">{field.label}</label>
                        <input
                            type="text"
                            placeholder={field.placeholder}
                            value={form[field.key as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        />
                    </div>
                ))}

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea
                        rows={4}
                        placeholder="Describe this landmark..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Latitude</label>
                        <input
                            type="text"
                            placeholder="e.g. 26.9468"
                            value={form.lat}
                            onChange={(e) => setForm({ ...form, lat: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Longitude</label>
                        <input
                            type="text"
                            placeholder="e.g. 85.9724"
                            value={form.lng}
                            onChange={(e) => setForm({ ...form, lng: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 transition rounded-lg py-3 font-medium text-sm"
                >
                    {loading ? "Saving..." : "Add Landmark"}
                </button>
            </div>
        </div>
    );
}