export interface Landmark {
  _id?: string;
  name: string;
  nepaliName: string;
  description: string;
  position: [number, number, number];
  lat: number;
  lng: number;
  coverImage: string;
}
export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  landmark?: string;
  image?: string;
  createdAt?: string;
}

export interface NewsItem {
  _id?: string;
  title: string;
  body: string;
  category: "festival" | "event" | "announcement" | "general";
  landmark?: string;
  image?: string;
  createdAt?: string;
}