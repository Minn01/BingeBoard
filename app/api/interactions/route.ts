// endpoint: api/interactions
import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose"; 
import UserMovieInteraction from "@/models/UserMovieInteraction";

// GET - fetch interactions (filter by userId, tmdbId, mediaType)
export async function GET(req: NextRequest) {
  await connect();
  const searchParams = req.nextUrl.searchParams; 
  const userId = searchParams.get("userId");
  const tmdbId = searchParams.get("tmdbId");
  const mediaType = searchParams.get("mediaType");

  const query: any = {};
  if (userId) query.userId = userId;
  if (tmdbId) query.tmdbId = Number(tmdbId);
  if (mediaType) query.mediaType = mediaType;

  const interactions = await UserMovieInteraction.find(query);
  return NextResponse.json(interactions);
}

// POST - create or update interaction
export async function POST(req: NextRequest) {
  await connect();
  const body = await req.json();

  const interaction = await UserMovieInteraction.findOneAndUpdate(
    { userId: body.userId, tmdbId: body.tmdbId },
    body,
    { new: true, upsert: true } // if not exists, create
  );

  return NextResponse.json(interaction, { status: 201 });
}

// DELETE - remove interaction
export async function DELETE(req: NextRequest) {
  await connect();
  const searchParams = req.nextUrl.searchParams; 
  const userId = searchParams.get("userId");
  const tmdbId = searchParams.get("tmdbId");

  if (!userId || !tmdbId) {
    return NextResponse.json({ error: "userId and tmdbId required" }, { status: 400 });
  }

  await UserMovieInteraction.findOneAndDelete({ userId, tmdbId });
  return NextResponse.json({ message: "Deleted successfully" });
}
