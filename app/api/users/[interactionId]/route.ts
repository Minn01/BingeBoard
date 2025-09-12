import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";
import { getUserFromRequest } from "@/lib/auth";

// PUT /api/users/watchlist/[interactionId]
export async function PUT(req: NextRequest, { params }: { params: { interactionId: string } }) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await UserMovieInteraction.findOneAndUpdate(
    { _id: params.interactionId, userId: user._id },
    { ...body, lastUpdated: new Date() },
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/users/watchlist/[interactionId]
export async function DELETE(req: NextRequest, { params }: { params: { interactionId: string } }) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await UserMovieInteraction.deleteOne({ _id: params.interactionId, userId: user._id });
  return NextResponse.json({ message: "Deleted" });
}
