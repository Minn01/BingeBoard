import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from '@/lib/auth';
import connect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";

export async function PUT(req: NextRequest) {
    try {
        // Check authentication
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connect();

        // Parse request body
        const body = await req.json();
        const { tmdbId, mediaType, isFavorite } = body;

        // Validate required fields
        if (!tmdbId || !mediaType) {
            return NextResponse.json({ 
                error: 'Missing required fields',
                required: ['tmdbId', 'mediaType']
            }, { status: 400 });
        }

        // Validate mediaType
        if (!['movie', 'tv'].includes(mediaType)) {
            return NextResponse.json({ 
                error: 'Invalid mediaType',
                allowed: ['movie', 'tv']
            }, { status: 400 });
        }

        // Validate isFavorite
        if (typeof isFavorite !== 'boolean') {
            return NextResponse.json({ 
                error: 'isFavorite must be a boolean value'
            }, { status: 400 });
        }

        console.log(`Setting favorite status for user ${user._id}, tmdbId: ${tmdbId}, mediaType: ${mediaType}, isFavorite: ${isFavorite}`);

        // Find existing interaction or create new one
        const existingInteraction = await UserMovieInteraction.findOne({
            userId: user._id,
            tmdbId: tmdbId
        });

        let updatedInteraction;

        if (existingInteraction) {
            // Update existing interaction
            updatedInteraction = await UserMovieInteraction.findByIdAndUpdate(
                existingInteraction._id,
                { 
                    isFavorite: isFavorite,
                    lastUpdated: new Date()
                },
                { new: true }
            );
            console.log(`Updated existing interaction: ${updatedInteraction._id}`);
        } else {
            // Create new interaction with just the favorite status
            updatedInteraction = await UserMovieInteraction.create({
                userId: user._id,
                tmdbId: tmdbId,
                mediaType: mediaType,
                isFavorite: isFavorite,
                dateAdded: new Date(),
                lastUpdated: new Date()
            });
            console.log(`Created new interaction: ${updatedInteraction._id}`);
        }

        // Return the updated interaction
        return NextResponse.json({
            success: true,
            message: isFavorite ? 'Added to favorites' : 'Removed from favorites',
            interaction: {
                id: updatedInteraction._id,
                userId: updatedInteraction.userId,
                tmdbId: updatedInteraction.tmdbId,
                mediaType: updatedInteraction.mediaType,
                isFavorite: updatedInteraction.isFavorite,
                status: updatedInteraction.status,
                personalRating: updatedInteraction.personalRating,
                lastUpdated: updatedInteraction.lastUpdated
            }
        }, { status: 200 });

    } catch (err) {
        console.error("Error in set_favorite API:", err);
        
        // Handle duplicate key error
        if (err instanceof Error && err.message.includes('duplicate key')) {
            return NextResponse.json({ 
                error: 'Interaction already exists for this user and movie/show'
            }, { status: 409 });
        }

        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        
        return NextResponse.json({ 
            error: "Internal Server Error",
            details: errorMessage,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
