import dbConnect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ tmdbId: string }> }) {
  await dbConnect();
  const { tmdbId } = await params;
  const { userId, action } = await req.json(); 

  const review = await UserReview.findById(tmdbId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  // Remove user from both arrays first
  review.likes = review.likes.filter((u: any) => u.toString() !== userId);
  review.dislikes = review.dislikes.filter((u: any) => u.toString() !== userId);

  if (action === "like") {
    review.likes.push(userId);
  } else if (action === "dislike") {
    review.dislikes.push(userId);
  }

  await review.save();
  return NextResponse.json(review);
}
