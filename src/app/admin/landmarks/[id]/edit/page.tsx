"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { geoToPlane } from "@/lib/geoUtils";

interface EditForm {
  name: string;
  nepaliName: string;
  description: string;
  coverImage: string;
  lat: string;
  lng: string;
}

export default function EditLandmark() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<EditForm>({
    name: "",
    nepaliName: "",
    description: "",
    coverImage: "",
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/landmarks/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const l = data.data;
          setForm({
            name: l.name || "",
            nepaliName: l.nepaliName || "",
            description: l.description || "",
            coverImage: l.coverImage || "",
            lat: String(l.lat || ""),
            lng: String(l.lng || ""),
          });
        }
      });
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    const position = geoToPlane(lat, lng);

    await fetch(`/api/landmarks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        nepaliName: form.nepaliName,
        description: form.description,
        coverImage: form.coverImage,
        position,
        lat,
        lng,
      }),
    });
    router.push("/admin/landmarks");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Edit Landmark</h2>
      <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
        {(
          [
            { label: "English Name", key: "name" },
            { label: "Nepali Name", key: "nepaliName" },
            { label: "Cover Image Path", key: "coverImage" },
          ] as { label: string; key: keyof EditForm }[]
        ).map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">{field.label}</label>
            <input
              type="text"
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-widest">Description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Latitude</label>
            <input
              type="text"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Longitude</label>
            <input
              type="text"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
            />
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