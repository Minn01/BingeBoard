// api/search/multi/
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const data = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`
    );

    if (!data.ok) {
        return NextResponse.json({ error: "Failed to fetch data from TMDB" }, { status: 500 });
    }   

    return NextResponse.json(await data.json());
}