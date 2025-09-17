// app/api/watchlist/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";

export async function GET() {
    try {
        await dbConnect();
        
        // Fetch interactions with user info
        const interactions = await UserMovieInteraction.find({})
            .populate("userId", "username");
        
        // Fetch movie details for each interaction
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
                    
                        // Transform data to match your Movie type
                        return {
                            id: details.id,
                            title: details.title || details.name, // TV shows use 'name'
                            poster_path: details.poster_path,
                            release_date: details.release_date || details.first_air_date, // TV shows use 'first_air_date'
                            vote_average: details.vote_average,
                            genre_ids: details.genre_ids || [],
                            overview: details.overview,
                            mediaType: item.mediaType,
                            
                            // User interaction data
                            userStatus: item.status as 'watched' | 'watching' | 'want_to_watch',
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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
