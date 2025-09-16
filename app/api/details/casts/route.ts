// endpoint : api/details/casts

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "";
    const mediaType = searchParams.get("mediaType") || "";

    if (!id) return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    if (!mediaType) return NextResponse.json({ error: "mediaType parameter is required" }, { status: 400 });

    const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch cast data from TMDB" }, { status: response.status });
    }

    return NextResponse.json(
        await response.json()
    );
}