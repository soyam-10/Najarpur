import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const LandmarkSchema = new mongoose.Schema(
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

async function seedLandmarks() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  try {
    await mongoose.connection.dropCollection("landmarks");
    console.log("🗑️  Dropped landmarks collection (stale indexes removed)");
  } catch (e) {
    console.log("ℹ️  No existing collection to drop, continuing...");
  }

  const LandmarkModel = mongoose.model("Landmark", LandmarkSchema);
  const { landmarks } = await import("../src/data/landmarks");

  for (const landmark of landmarks) {
    await LandmarkModel.create(landmark);
    console.log(`✓ Seeded: ${landmark.name}`);
  }

  console.log("\n✅ All landmarks seeded fresh with MongoDB _id.");
  process.exit(0);
}

seedLandmarks().catch((err) => {
  console.error(err);
  process.exit(1);
});