
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";

// GET all reviews (optionally filter by tmdbId + mediaType)
export async function GET(req: NextRequest) {
  await dbConnect();
  const searchParams = req.nextUrl.searchParams;
  const tmdbId = searchParams.get("tmdbId") || searchParams.get("id");
  const mediaType = searchParams.get("mediaType");

  const query: any = {};
  if (tmdbId) query.tmdbId = Number(tmdbId);
  if (mediaType) query.mediaType = mediaType;

  const reviews = await UserReview.find(query).populate("userId", "username email");
  return NextResponse.json(reviews);
}

// POST - create a new review
export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const review = await UserReview.create(body);
  return NextResponse.json(review, { status: 201 });
}

// PUT - update a review
export async function PUT(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { id, ...updateData } = body;

  const updated = await UserReview.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(updated);
}

// DELETE - delete a review
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

  await UserReview.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}
