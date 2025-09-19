import mongoose from "mongoose";

const UserReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ["movie", "tv"], required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  reviewText: { type: String, maxlength: 1000 },
  hasSpoilers: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.UserReview ||
  mongoose.model("UserReview", UserReviewSchema);
