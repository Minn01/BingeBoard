import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/mongoose";
import UserReview from "@/models/UserReview";

// GET /api/reviews/:tmdbId?type=movie|tv&page=1
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ tmdbId: string }> }  // ✅ Changed to Promise
) {
    await connect();

    const { tmdbId } = await params;

    const searchParams = req.nextUrl.searchParams;
    const mediaType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    const reviews = await UserReview.find({
        tmdbId: Number(tmdbId),
        mediaType,
        isPublic: true,
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(reviews);
}
