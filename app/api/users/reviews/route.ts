import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/users/reviews
export async function GET(req: NextRequest) {
  await connect();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await UserReview.find({ userId: user._id }).lean();
  return NextResponse.json(reviews);
}
