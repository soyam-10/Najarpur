import mongoose, { Schema, Model } from "mongoose";
import { Landmark } from "@/types";

const LandmarkSchema = new Schema<Landmark>(
  {
    name: { type: String, required: true },
    nepaliName: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: [Number], required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    coverImage: { type: String, required: true },
  },
  { timestamps: true }
);

const LandmarkModel: Model<Landmark> =
  mongoose.models.Landmark || mongoose.model<Landmark>("Landmark", LandmarkSchema);

export default LandmarkModel;