// // Centralized fetch helpers for reviews and interactions
// // These hit your Next.js API routes

// // -------------------- Reviews --------------------

// // GET reviews for a movie/tv show
// export async function getReviews(tmdbId: number, mediaType: "movie" | "tv") {
//   const res = await fetch(`/api/reviews?tmdbId=${tmdbId}&mediaType=${mediaType}`);
//   if (!res.ok) throw new Error("Failed to fetch reviews");
//   return res.json();
// }

// // POST a new review
// export async function postReview(review: {
//   userId: string;
//   tmdbId: number;
//   mediaType: "movie" | "tv";
//   rating: number;
//   reviewText: string;
//   hasSpoilers?: boolean;
//   isPublic?: boolean;
// }) {
//   const res = await fetch("/api/reviews", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(review),
//   });
//   if (!res.ok) throw new Error("Failed to post review");
//   return res.json();
// }

// // PUT update review
// export async function updateReview(id: string, update: Partial<{
//   rating: number;
//   reviewText: string;
//   hasSpoilers: boolean;
//   isPublic: boolean;
// }>) {
//   const res = await fetch("/api/reviews", {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id, ...update }),
//   });
//   if (!res.ok) throw new Error("Failed to update review");
//   return res.json();
// }

// // DELETE review
// export async function deleteReview(id: string) {
//   const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
//   if (!res.ok) throw new Error("Failed to delete review");
//   return res.json();
// }


// // -------------------- Interactions --------------------

// // GET interactions (for a user, or a movie/tv)
// export async function getInteractions(params: {
//   userId?: string;
//   tmdbId?: number;
//   mediaType?: "movie" | "tv";
// }) {
//   const query = new URLSearchParams();
//   if (params.userId) query.append("userId", params.userId);
//   if (params.tmdbId) query.append("tmdbId", String(params.tmdbId));
//   if (params.mediaType) query.append("mediaType", params.mediaType);

//   const res = await fetch(`/api/interactions?${query.toString()}`);
//   if (!res.ok) throw new Error("Failed to fetch interactions");
//   return res.json();
// }

// // POST (create or update) interaction
// export async function postInteraction(interaction: {
//   userId: string;
//   tmdbId: number;
//   mediaType: "movie" | "tv";
//   status?: "watched" | "watching" | "want_to_watch" | "dropped";
//   personalRating?: number;
//   review?: string;
//   hasSpoilers?: boolean;
//   isFavorite?: boolean;
//   seasonsWatched?: number;
//   episodesWatched?: number;
// }) {
//   const res = await fetch("/api/interactions", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(interaction),
//   });
//   if (!res.ok) throw new Error("Failed to post interaction");
//   return res.json();
// }

// // DELETE interaction
// export async function deleteInteraction(userId: string, tmdbId: number) {
//   const res = await fetch(`/api/interactions?userId=${userId}&tmdbId=${tmdbId}`, {
//     method: "DELETE",
//   });
//   if (!res.ok) throw new Error("Failed to delete interaction");
//   return res.json();
// }
