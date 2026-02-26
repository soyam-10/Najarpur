"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Event } from "@/types";

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    if (data.success) setEvents(data.data);
    setLoading(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <Link
          href="/admin/events/new"
          className="bg-green-600 hover:bg-green-500 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Event
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-sm">No events yet.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                {event.landmark && (
                  <span className="text-xs text-gray-500">{event.landmark}</span>
                )}
                <p className="font-semibold">{event.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                <p className="text-gray-600 text-xs">{event.date}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/events/${event._id}/edit`}
                  className="text-xs text-blue-400 hover:text-blue-300 transition px-3 py-1.5 rounded-lg bg-white/5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteEvent(event._id!)}
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