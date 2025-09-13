import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";
import { getUserFromRequest } from "@/lib/auth";

// PUT /api/reviews/:reviewId
export async function PUT(req: NextRequest, { params }: { params: { reviewId: string } }) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await UserReview.findOneAndUpdate(
    { _id: params.reviewId, userId: user._id },
    { ...body, updatedAt: new Date() },
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/reviews/:reviewId
export async function DELETE(req: NextRequest, { params }: { params: { reviewId: string } }) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await UserReview.deleteOne({ _id: params.reviewId, userId: user._id });
  return NextResponse.json({ message: "Deleted" });
}
