import { connectToDatabase } from "@/lib/mongodb";
import EventModel from "@/models/Event";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const landmark = searchParams.get("landmark");

    const query = landmark ? { landmark } : {};
    const events = await EventModel.find(query)
      .sort({ date: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const event = await EventModel.create(body);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}