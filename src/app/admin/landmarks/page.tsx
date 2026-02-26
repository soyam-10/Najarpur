"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Landmark } from "@/types";

export default function AdminLandmarks() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLandmarks = async () => {
    setLoading(true);
    const res = await fetch("/api/landmarks");
    const data = await res.json();
    if (data.success) setLandmarks(data.data);
    setLoading(false);
  };

  const deleteLandmark = async (id: string) => {
    if (!confirm("Delete this landmark? This cannot be undone.")) return;
    await fetch(`/api/landmarks/${id}`, { method: "DELETE" });
    fetchLandmarks();
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchLandmarks(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Landmarks</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all village landmarks.</p>
        </div>
        <Link
          href="/admin/landmarks/new"
          className="bg-green-600 hover:bg-green-500 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Landmark
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      ) : landmarks.length === 0 ? (
        <p className="text-gray-500 text-sm">No landmarks yet.</p>
      ) : (
        <div className="space-y-3">
          {landmarks.map((landmark) => (
            <div
              key={landmark._id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <p className="font-semibold">{landmark.name}</p>
                <p className="text-green-400 text-xs">{landmark.nepaliName}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{landmark.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/landmarks/${landmark._id}/edit`}
                  className="text-xs text-blue-400 hover:text-blue-300 transition px-3 py-1.5 rounded-lg bg-white/5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteLandmark(landmark._id!)}
                  className="text-xs text-red-400 hover:text-red-300 transition px-3 py-1.5 rounded-lg bg-white/5"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}