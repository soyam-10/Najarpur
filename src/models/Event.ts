import mongoose, { Schema, Model } from "mongoose";
import { Event } from "@/types";

const EventSchema = new Schema<Event>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    landmark: { type: String, required: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const EventModel: Model<Event> =
  mongoose.models.Event || mongoose.model<Event>("Event", EventSchema);

export default EventModel;