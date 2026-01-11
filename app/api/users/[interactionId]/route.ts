import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";
import { getUserFromRequest } from "@/lib/auth";

// PUT /api/users/watchlist/[interactionId]
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ interactionId: string }> }  // ✅ Changed to Promise
) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { interactionId } = await params;  // ✅ Await params
  const body = await req.json();
  
  const updated = await UserMovieInteraction.findOneAndUpdate(
    { _id: interactionId, userId: user._id },  // ✅ Use awaited param
    { ...body, lastUpdated: new Date() },
    { new: true }
  );
  
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/users/watchlist/[interactionId]
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ interactionId: string }> }  // ✅ Changed to Promise
) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { interactionId } = await params;  // ✅ Await params
  
  await UserMovieInteraction.deleteOne({ _id: interactionId, userId: user._id });
  return NextResponse.json({ message: "Deleted" });
}
