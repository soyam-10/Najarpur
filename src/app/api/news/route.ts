import { connectToDatabase } from "@/lib/mongodb";
import NewsModel from "@/models/News";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const landmark = searchParams.get("landmark");
    const category = searchParams.get("category");

    const query: Record<string, string> = {};
    if (landmark) query.landmark = landmark;
    if (category) query.category = category;

    const news = await NewsModel.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const news = await NewsModel.create(body);
    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create news" },
      { status: 500 }
    );
  }
}