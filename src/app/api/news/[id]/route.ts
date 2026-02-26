import { connectToDatabase } from "@/lib/mongodb";
import NewsModel from "@/models/News";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectToDatabase();
        await NewsModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectToDatabase();
        const body = await req.json();
        const updated = await NewsModel.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}