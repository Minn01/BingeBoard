import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";
import { getUserFromRequest } from "@/lib/auth"; // helper to decode token

// GET /api/users/watchlist?status=watched|watching|want_to_watch|all
export async function GET(req: NextRequest) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const filter: any = { userId: user._id };
  if (status && status !== "all") filter.status = status;

  const interactions = await UserMovieInteraction.find(filter).lean();
  return NextResponse.json(interactions);
}

// POST /api/users/watchlist
export async function POST(req: NextRequest) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { tmdbId, mediaType, status } = body;

  if (!tmdbId || !mediaType || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const interaction = await UserMovieInteraction.create({
    userId: user._id,
    tmdbId,
    mediaType,
    status,
    dateAdded: new Date(),
    lastUpdated: new Date(),
  });

  return NextResponse.json(interaction, { status: 201 });
}
