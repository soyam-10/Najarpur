import { connectToDatabase } from "@/lib/mongodb";
import LandmarkModel from "@/models/Landmark";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const landmarks = await LandmarkModel.find().lean();
    return NextResponse.json({ success: true, data: landmarks });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const landmark = await LandmarkModel.create(body);
    return NextResponse.json({ success: true, data: landmark }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}