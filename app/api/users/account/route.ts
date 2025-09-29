import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/models/User";
import UserMovieInteraction from "@/models/UserMovieInteraction";
import UserReview from "@/models/UserReview";
import { getUserFromRequest } from "@/lib/auth";

/**
 * DELETE /api/users/account
 * Deletes the authenticated user's account and all associated data
 */
export async function DELETE(req: NextRequest) {
  try {
    await connect();
    
    // Get authenticated user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const userId = user._id;

    // Delete all user's movie/TV interactions
    await UserMovieInteraction.deleteMany({ userId });
    
    // Delete all user's reviews
    await UserReview.deleteMany({ userId });
    
    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Return success response
    return NextResponse.json(
      { 
        message: "Account deleted successfully",
        deleted: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete account",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}