// app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from '@/lib/auth';
import connect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";

export async function GET(req: NextRequest) {
    try {
        console.log("Starting favorites API...");
        
        // Check authentication
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        
        if (!process.env.TMDB_API_KEY) {
            console.error("TMDB_API_KEY is missing");
            return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
        }
        
        await connect();
        console.log("Database connected successfully");
        
        // Fetch interactions that are marked as favorites for the current user
        console.log("Fetching favorite interactions for user:", user._id);
        const favoriteInteractions = await UserMovieInteraction.find({
            userId: user._id,
            isFavorite: true
        }).populate("userId", "username");
        
        console.log(`Found ${favoriteInteractions.length} favorite interactions`);
        
        // Fetch movie details for each favorite interaction
        const results = await Promise.all(
            favoriteInteractions.map(async (item, index) => {
                try {
                    console.log(`Fetching TMDB for favorite ${index + 1}/${favoriteInteractions.length}: ${item.mediaType}/${item.tmdbId}`);
                    
                    const tmdbUrl = `https://api.themoviedb.org/3/${item.mediaType}/${item.tmdbId}?api_key=${process.env.TMDB_API_KEY}`;
                    const res = await fetch(tmdbUrl);
                    
                    if (!res.ok) {
                        console.error(`TMDB API error for ${item.tmdbId}: ${res.status} ${res.statusText}`);
                        return null;
                    }
                    
                    const details = await res.json();
                    console.log(`Successfully fetched details for favorite: ${details.title || details.name}`);
                    
                    // Transform data to match your Movie type
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
                        userStatus: item.status as 'watched' | 'watching' | 'want_to_watch',
                        userRating: item.personalRating,
                        episodesWatched: item.episodesWatched,
                        totalEpisodes: details.number_of_episodes || undefined,
                        totalSeasons: details.number_of_seasons || undefined,
                    };
                } catch (error) {
                    console.error(`Error processing favorite item ${item.tmdbId}:`, error);
                    return null;
                }
            })
        );
        
        const validResults = results.filter(Boolean);
        console.log(`Returning ${validResults.length} valid favorite results`);
        
        return NextResponse.json(validResults, { status: 200 });
        
    } catch (err) {
        console.error("Error in favorites API:", err);
        
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error details:", { message: errorMessage });
        
        return NextResponse.json({ 
            error: "Internal Server Error",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}