// endpoint : api/details/similars
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "";
    const mediaType = searchParams.get("mediaType") || "";
    const page = searchParams.get("page") || "1";

    if (!id) return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    if (!mediaType) return NextResponse.json({ error: "mediaType parameter is required" }, { status: 400 });

    const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`
    );
    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch similar media from TMDB" }, { status: response.status });
    }

    return NextResponse.json(
        await response.json()
    );
}