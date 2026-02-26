import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("✓ Connected to MongoDB");

  const AdminModel =
    mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

  const email = process.env.ADMIN_EMAIL as string;
  const password = process.env.ADMIN_PASSWORD as string;

  const existing = await AdminModel.findOne({ email });
  if (existing) {
    await AdminModel.deleteOne({ email });
    console.log("🗑️  Removed existing admin");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await AdminModel.create({ email, password: hashedPassword, role: "admin" });
  console.log(`✅ Admin seeded: ${email}`);

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});