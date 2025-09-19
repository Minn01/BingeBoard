import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserMovieInteraction from "@/models/UserMovieInteraction";

export async function GET() {
    try {
        console.log("Testing database connection...");
        
        // Test 1: Check environment variables
        const hasMongoUri = !!process.env.MONGODB_URI || !!process.env.MONGO_URI;
        const hasTmdbKey = !!process.env.TMDB_API_KEY;
        
        console.log("Environment check:", { hasMongoUri, hasTmdbKey });
        
        if (!hasMongoUri) {
            return NextResponse.json({ 
                error: "MongoDB URI not found in environment variables",
                checkedVars: ["MONGODB_URI", "MONGO_URI"]
            }, { status: 500 });
        }
        
        if (!hasTmdbKey) {
            return NextResponse.json({ 
                error: "TMDB_API_KEY not found in environment variables"
            }, { status: 500 });
        }
        
        // Test 2: Database connection
        console.log("Connecting to database...");
        await dbConnect();
        console.log("Database connected successfully");
        
        // Test 3: Simple query
        console.log("Testing database query...");
        const count = await UserMovieInteraction.countDocuments();
        console.log(`Found ${count} documents in UserMovieInteraction collection`);
        
        // Test 4: Sample TMDB API call
        console.log("Testing TMDB API...");
        const tmdbTest = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=${process.env.TMDB_API_KEY}`);
        const tmdbWorking = tmdbTest.ok;
        
        return NextResponse.json({ 
            status: "success",
            tests: {
                environment: { hasMongoUri, hasTmdbKey },
                database: { connected: true, documentCount: count },
                tmdb: { working: tmdbWorking, status: tmdbTest.status }
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (err) {
        console.error("Test failed:", err);
        
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        const errorStack = err instanceof Error ? err.stack : "";
        
        return NextResponse.json({ 
            error: "Test failed",
            details: errorMessage,
            stack: errorStack,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}