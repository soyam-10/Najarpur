import mongoose, { Schema, Model } from "mongoose";
import { NewsItem } from "@/types";

const NewsSchema = new Schema<NewsItem>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ["festival", "event", "announcement", "general"],
      required: true,
    },
    landmark: { type: String, required: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const NewsModel: Model<NewsItem> =
  mongoose.models.News || mongoose.model<NewsItem>("News", NewsSchema);

export default NewsModel;