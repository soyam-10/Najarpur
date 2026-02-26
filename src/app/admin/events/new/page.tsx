"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Landmark } from "@/types";

export default function NewEvent() {
  const router = useRouter();
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    landmark: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/landmarks")
      .then((r) => r.json())
      .then((data) => { if (data.success) setLandmarks(data.data); });
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date) {
      setError("Title, description and date are required.");
      return;
    }
    setLoading(true);
    const payload = { ...form, landmark: form.landmark || undefined };
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/admin/events");
    } else {
      setError("Failed to create event.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Add Event</h2>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-widest">Title</label>
          <input
            type="text"
            placeholder="Event title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-widest">Description</label>
          <textarea
            rows={4}
            placeholder="Describe the event..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
            />
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
          {loading ? "Saving..." : "Add Event"}
        </button>
      </div>
    </div>
  );
}