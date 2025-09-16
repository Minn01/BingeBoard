// app/api/interactions/average/route.ts
import dbConnect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const tmdbId = Number(searchParams.get("tmdbId"));
  const mediaType = searchParams.get("mediaType");

  if (!tmdbId || !mediaType) {
    return NextResponse.json({ error: "Missing tmdbId or mediaType" }, { status: 400 });
  }

  const result = await UserMovieInteraction.aggregate([
    { $match: { tmdbId, mediaType, personalRating: { $ne: null } } },
    {
      $group: {
        _id: "$tmdbId",
        avgRating: { $avg: "$personalRating" },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return NextResponse.json({ avgRating: 0, count: 0 });
  }

  return NextResponse.json({ avgRating: result[0].avgRating, count: result[0].count });
}
