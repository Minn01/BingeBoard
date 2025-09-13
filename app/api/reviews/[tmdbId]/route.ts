import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";

// GET /api/reviews/:tmdbId?type=movie|tv&page=1
export async function GET(req: NextRequest, { params }: { params: { tmdbId: string } }) {
  await connect();

  const searchParams = req.nextUrl.searchParams; 
  const mediaType = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  const reviews = await UserReview.find({
    tmdbId: Number(params.tmdbId),
    mediaType,
    isPublic: true,
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(reviews);
}
