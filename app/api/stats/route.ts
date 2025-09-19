import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from '@/lib/auth';
import connect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connect();
        console.log("Getting stats for user:", user._id);

        // Get counts for each status
        const [watchedCount, watchingCount, wantToWatchCount, favoritesCount] = await Promise.all([
            UserMovieInteraction.countDocuments({ userId: user._id, status: 'watched' }),
            UserMovieInteraction.countDocuments({ userId: user._id, status: 'watching' }),
            UserMovieInteraction.countDocuments({ userId: user._id, status: 'want_to_watch' }),
            UserMovieInteraction.countDocuments({ userId: user._id, isFavorite: true })
        ]);

        console.log("Stats:", { watchedCount, watchingCount, wantToWatchCount, favoritesCount });

        return NextResponse.json({
            watched: watchedCount,
            watching: watchingCount,
            wantToWatch: wantToWatchCount,
            favorites: favoritesCount,
            total: watchedCount + watchingCount + wantToWatchCount
        });

    } catch (err) {
        console.error("Error fetching stats:", err);
        
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        
        return NextResponse.json({ 
            error: "Internal Server Error",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}