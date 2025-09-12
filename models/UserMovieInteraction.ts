// models/UserMovieInteraction.ts
import mongoose from "mongoose";

const UserMovieInteractionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ["movie", "tv"], required: true },
    status: { type: String, enum: ["watched", "watching", "want_to_watch", "dropped"] },
    personalRating: { type: Number, min: 1, max: 10 },
    review: { type: String, maxlength: 1000 },
    hasSpoilers: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    seasonsWatched: { type: Number, default: 0 },
    episodesWatched: { type: Number, default: 0 },
    dateAdded: { type: Date, default: Date.now },
    dateWatched: { type: Date },
    lastUpdated: { type: Date, default: Date.now },
});

// Unique compound index: one entry per user per TMDB ID
UserMovieInteractionSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

export default mongoose.models.UserMovieInteraction ||
  mongoose.model("UserMovieInteraction", UserMovieInteractionSchema);
