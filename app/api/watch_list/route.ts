import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get current user
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query interactions only for this user
    const interactions = await UserMovieInteraction.find({ userId: user._id })
      .populate("userId", "username");

    // Fetch TMDB details for each interaction
    const results = await Promise.all(
      interactions.map(async (item) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/${item.mediaType}/${item.tmdbId}?api_key=${process.env.TMDB_API_KEY}`
          );

          if (!res.ok) {
            console.error(`Failed to fetch TMDB for ${item.tmdbId}`);
            return null;
          }

          const details = await res.json();

          return {
            id: details.id,
            title: details.title || details.name,
            poster_path: details.poster_path,
            release_date: details.release_date || details.first_air_date,
            vote_average: details.vote_average,
            genre_ids: details.genre_ids || [],
            overview: details.overview,
            mediaType: item.mediaType,

            // User interaction data
            userStatus: item.status as
              | "watched"
              | "watching"
              | "want_to_watch"
              | "dropped",
            userRating: item.personalRating,
            episodesWatched: item.episodesWatched,
            totalEpisodes: details.number_of_episodes || undefined,
            totalSeasons: details.number_of_seasons || undefined,
          };
        } catch (error) {
          console.error(`Error processing item ${item.tmdbId}:`, error);
          return null;
        }
      })
    );

    const validResults = results.filter(Boolean);
    return NextResponse.json(validResults, { status: 200 });
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
