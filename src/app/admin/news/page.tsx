"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsItem } from "@/types";

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    if (data.success) setNews(data.data);
    setLoading(false);
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    fetchNews();
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchNews(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">News</h2>
        <Link
          href="/admin/news/new"
          className="bg-green-600 hover:bg-green-500 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Post News
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      ) : news.length === 0 ? (
        <p className="text-gray-500 text-sm">No news yet.</p>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                  {item.landmark && (
                    <span className="text-xs text-gray-500">{item.landmark}</span>
                  )}
                </div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{item.body}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/news/${item._id}/edit`}
                  className="text-xs text-blue-400 hover:text-blue-300 transition px-3 py-1.5 rounded-lg bg-white/5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteNews(item._id!)}
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