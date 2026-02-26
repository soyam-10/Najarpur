import { useEffect, useState } from "react";
import { Event, NewsItem, Landmark } from "@/types";

interface LandmarkData {
  landmark: Landmark | null;
  events: Event[];
  news: NewsItem[];
  loading: boolean;
}

export function useLandmarkData(landmarkId: string | null): LandmarkData {
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!landmarkId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLandmark(null);
      setEvents([]);
      setNews([]);
      return;
    }

    setLoading(true);

    Promise.all([
      fetch(`/api/landmarks/${landmarkId}`).then((r) => r.json()),
      fetch(`/api/events?landmark=${landmarkId}`).then((r) => r.json()),
      fetch(`/api/news?landmark=${landmarkId}`).then((r) => r.json()),
    ])
      .then(([landmarkData, eventsData, newsData]) => {
        if (landmarkData.success) setLandmark(landmarkData.data);
        if (eventsData.success) setEvents(eventsData.data);
        if (newsData.success) setNews(newsData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [landmarkId]);

  return { landmark, events, news, loading };
}