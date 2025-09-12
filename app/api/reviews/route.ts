import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";
import { getUserFromRequest } from "@/lib/auth";

// POST /api/reviews
export async function POST(req: NextRequest) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tmdbId, mediaType, rating, reviewText, hasSpoilers } = await req.json();

  if (!tmdbId || !mediaType || !rating) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const review = await UserReview.create({
    userId: user._id,
    tmdbId,
    mediaType,
    rating,
    reviewText,
    hasSpoilers,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json(review, { status: 201 });
}
