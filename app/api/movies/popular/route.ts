import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);

    const data = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    );

    if (!data.ok) {
        return NextResponse.json({ error: "Failed to fetch popular movies from TMDB" }, { status: 500 });
    }   

    return NextResponse.json(await data.json());
}