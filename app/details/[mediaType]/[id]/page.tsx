'use client'

import { Star } from "lucide-react";
import Movie from "../../../types/Movie";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UserReview from "@/app/components/UserReview";

// TMDB Cast interface
interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

// TMDB Similar Title interface
interface Similar {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
}

// TMDB Response interfaces
interface CreditsResponse {
    cast: Cast[];
}

interface RecommendationsResponse {
    results: Similar[];
}

interface Review {
    id: number;
    username: string;
    rating: number;
    reviewText: string;
    likes: string[]; // array of user IDs who liked
    dislikes: string[]; // array of user IDs who disliked
    hasSpoilers: boolean;
}

// Genre mapping
const genres: { [key: number]: string } = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

// TODO: ignore some of the typescript errors it works regardless
export default function MovieDetailsPage() {
    // other stuff
    const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null); // Add user state
    const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [casts, setCasts] = useState<Cast[]>([]);
    const [similars, setSimilars] = useState<Similar[]>([]);
    const [loading, setLoading] = useState(true);

    // reviews
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ text: '', rating: 5, hasSpoilers: false });

    // User interaction state
    const [status, setStatus] = useState<'watched' | 'watching' | 'want_to_watch' | 'dropped' | null>(null);
    const [personalRating, setPersonalRating] = useState<number | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [seasonsWatched, setSeasonsWatched] = useState(0);
    const [episodesWatched, setEpisodesWatched] = useState(0);
    const [isRating, setIsRating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userRatingAvg, setUserRatingAvg] = useState<number | null>(null);

    // Toggle visibility
    const [showCasts, setShowCasts] = useState(false);
    const [showSimilars, setShowSimilars] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    // Fetch movie details
    useEffect(() => {
        if (!id || !mediaType) return;

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me');
                if (!res.ok) throw new Error('Not logged in');
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchMovie = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/details?id=${id}&mediaType=${mediaType}`);
                if (!res.ok) throw new Error('Failed to fetch movie');
                const data: Movie = await res.json();

                setMovie({
                    id: data.id,
                    mediaType: mediaType as 'movie' | 'tv',
                    title: data.title || data.name || 'Unknown Title',
                    poster_path: data.poster_path,
                    backdrop_path: data.backdrop_path,
                    release_date: data.release_date || data.first_air_date || '',
                    vote_average: Math.round(data.vote_average * 10) / 10,
                    genre_ids: data.genres ? data.genres.map((g: { id: number }) => g.id) : [],
                    overview: data.overview,
                    userStatus: undefined,
                    userRating: undefined,
                    episodesWatched: undefined,
                    totalEpisodes: data.number_of_episodes,
                    totalSeasons: data.number_of_seasons
                });
            } catch (err) {
                console.error(err);
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
        fetchUser();
    }, [id, mediaType]);

    // fetch interactions
    useEffect(() => {
        if (!user) return; // wait for user to load

        const fetchInteraction = async () => {
            try {
                const res = await fetch(
                    `/api/interactions?userId=${user._id}&tmdbId=${id}&mediaType=${mediaType}`
                );
                if (!res.ok) throw new Error("Failed to fetch interaction");
                const data = await res.json();

                if (data.length > 0) {
                    const interaction = data[0];
                    setStatus(interaction.status);
                    setPersonalRating(interaction.personalRating);
                    setIsFavorite(interaction.isFavorite);
                    setSeasonsWatched(interaction.seasonsWatched || 0);
                    setEpisodesWatched(interaction.episodesWatched || 0);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchInteraction();
    }, [user, id, mediaType])

    // fetch aggregate user ratings
    useEffect(() => {
        if (!id || !mediaType) return;

        const fetchUserRating = async () => {
            try {
                const res = await fetch(`/api/interactions/average?tmdbId=${id}&mediaType=${mediaType}`);
                if (!res.ok) throw new Error("Failed to fetch user rating");
                const data = await res.json();
                setUserRatingAvg(data.avgRating ? Math.round(data.avgRating * 10) / 10 : 0);
            } catch (err) {
                console.error(err);
                setUserRatingAvg(0);
            }
        };

        fetchUserRating();
    }, [id, mediaType]);


    // Lazy fetchers
    const fetchCasts = async () => {
        if (casts.length > 0) return;
        try {
            const res = await fetch(`/api/details/casts?id=${id}&mediaType=${mediaType}`);
            if (!res.ok) throw new Error('Failed to fetch casts');
            const data: CreditsResponse = await res.json();
            setCasts(data.cast || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSimilars = async () => {
        if (similars.length > 0) return;
        try {
            const res = await fetch(`/api/details/similars?id=${id}&mediaType=${mediaType}`);
            if (!res.ok) throw new Error('Failed to fetch similar titles');
            const data: RecommendationsResponse = await res.json();
            setSimilars(data.results || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReviews = async () => {
        if (reviews.length > 0) return;
        try {
            const res = await fetch(`/api/reviews?id=${id}&mediaType=${mediaType}`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data: Review[] = await res.json();
            console.log(data[0].username);

            setReviews(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveInteraction = async () => {
        try {
            const body = {
                userId: user._id, // TODO: ignore
                tmdbId: Number(id),
                mediaType,
                status,
                personalRating,
                isFavorite,
                seasonsWatched,
                episodesWatched,
            };

            const res = await fetch("/api/interactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Failed to save interaction");

            const saved = await res.json();
            console.log("Saved interaction:", saved);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVote = async (reviewId: string, action: "like" | "dislike") => {
        try {
            const res = await fetch(`/api/users/reviews/${reviewId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, action }),
            });

            if (!res.ok) throw new Error("Failed to vote");
            const updated = await res.json();

            setReviews(prev =>
                prev.map(r => (r._id === reviewId ? updated : r))
            );
        } catch (err) {
            console.error(err);
        }
    };


    // Add review
    const handleAddReview = async () => {
        if (!newReview.text.trim() || !user) return; // ensure text and user exist

        const reviewData = {
            userId: user._id,
            username: user.username,
            tmdbId: Number(id),
            mediaType,
            reviewText: newReview.text,
            rating: newReview.rating,
            hasSpoilers: newReview.hasSpoilers,
            likes: [],
            dislikes: []
        };

        console.log("user: " + user._id + ", username : " + user.username);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData),
            });

            if (!res.ok) throw new Error("Failed to save review");

            const savedReview = await res.json();

            // Update local state with saved review
            setReviews([savedReview, ...reviews]);
            setNewReview({ text: "", rating: 5, hasSpoilers: false });
        } catch (err) {
            console.error(err);
        }
    };


    const handleViewDetails = (contentId: number, contentMedia: 'movie' | 'tv') => {
        router.push(`/details/${contentMedia}/${contentId}`);
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!movie) return <p className="text-center mt-10">Movie not found</p>;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/api/placeholder/800/400';

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            {/* Backdrop */}
            {movie.backdrop_path && (
                <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}
                />
            )}

            <div className="relative max-w-6xl mx-auto py-12 px-4">
                {/* Movie Details */}
                <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full md:w-80 rounded-lg shadow-2xl"
                        loading="lazy"
                    />
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                        <p className="text-gray-300 mb-4">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>

                        {/* Ratings */}
                        <div className="flex items-center mb-5 space-x-2 gap-5">
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold">General Ratings</span>
                                <div className="flex mt-1.5 gap-1.5 items-center">
                                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-semibold">{movie.vote_average}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold">User Ratings</span>
                                <div className="flex mt-1.5 gap-1.5 items-center">
                                    <Star className="w-6 h-6 fill-green-400 text-green-400" />
                                    <span className="text-xl font-semibold">{userRatingAvg ?? "-"}</span>
                                </div>
                            </div>
                        </div>

                        {/* User Interactions */}
                        <div className="flex flex-row gap-5">
                            <select value={status || ''} onChange={e => setStatus(e.target.value as any)} className="bg-gray-800 px-2 py-1 rounded">
                                <option value="">Status</option>
                                <option value="watched">Watched</option>
                                <option value="watching">Watching</option>
                                <option value="want_to_watch">Want to Watch</option>
                                <option value="dropped">Dropped</option>
                            </select>

                            {isRating ? (
                                <div className="flex gap-2 items-center">
                                    <label className="flex items-center text-xl font-semibold mr-2">Personal Rating:</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={personalRating || ''}
                                        onChange={e => setPersonalRating(Number(e.target.value))}
                                        className="bg-gray-800 px-2 py-1 rounded w-16"
                                    />
                                    <button className="text-blue-400" onClick={() => setIsRating(false)}>done</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <label className="flex items-center text-xl font-semibold mr-2">
                                        Personal Rating:
                                        <span className="text-3xl font-semibold ml-3">{personalRating ?? "-"}</span>
                                    </label>
                                    <button className="text-blue-400" onClick={() => setIsRating(true)}>edit</button>
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mt-6 mb-6">
                            {movie.genre_ids.map(id => (
                                <span key={id} className="px-3 py-1 bg-gray-700 rounded-full text-sm">{genres[id]}</span>
                            ))}
                        </div>

                        {/* Seasons & Episodes */}
                        {mediaType === 'tv' && (
                            <div className="flex gap-4 items-center mb-2">
                                <span className="font-semibold">Total Seasons: {movie.totalSeasons ?? "-"}</span>
                                <span className="font-semibold">Total Episodes: {movie.totalEpisodes ?? "-"}</span>
                            </div>
                        )}

                        {mediaType === 'tv' && (
                            isEditing ? (
                                <div className="flex gap-4">
                                    <div>
                                        <label className="text-xl font-semibold mr-2">Seasons Watched:</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={movie.totalSeasons}
                                            value={seasonsWatched}
                                            onChange={e => setSeasonsWatched(Number(e.target.value))}
                                            className="bg-gray-800 px-2 py-1 rounded w-16"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xl font-semibold mr-2">Episodes Watched:</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={movie.totalEpisodes}
                                            value={episodesWatched}
                                            onChange={e => setEpisodesWatched(Number(e.target.value))}
                                            className="bg-gray-800 px-2 py-1 rounded w-16"
                                        />
                                    </div>
                                    <button className="text-blue-400" onClick={() => setIsEditing(false)}>done</button>
                                </div>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    <span className="text-xl font-semibold">Seasons Watched: {seasonsWatched}</span>
                                    <span className="text-xl font-semibold">Episodes Watched: {episodesWatched}</span>
                                    <button className="text-blue-400" onClick={() => setIsEditing(true)}>edit</button>
                                </div>
                            )
                        )}

                        {/* Overview */}
                        <p className="text-gray-200 mb-6 leading-relaxed mt-3">{movie.overview}</p>

                        {/* Buttons */}
                        <div className="flex gap-5">
                            <button onClick={handleSaveInteraction}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                                Save
                            </button>
                            <button
                                className={`px-6 py-2 rounded-lg transition-colors border ${isFavorite ? "bg-red-600 border-red-600" : "border-gray-500 hover:bg-gray-800"}`}
                                onClick={() => setIsFavorite(!isFavorite)}
                            >
                                {isFavorite ? "Remove Favorite" : "Add to Favorites"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                <div className="mt-12">
                    <div className="flex justify-between items-center border-t border-gray-700 py-2">
                        <span className="font-bold text-xl text-gray-300">Cast</span>
                        <button
                            className="text-blue-500 font-semibold hover:text-blue-400"
                            onClick={() => {
                                setShowCasts(prev => !prev);
                                if (!showCasts) fetchCasts();
                            }}
                        >
                            {showCasts ? "Hide" : "Show"}
                        </button>
                    </div>
                    {showCasts ? (
                        casts.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 mt-4">
                                {casts.map(actor => (
                                    <div key={actor.id} className="flex-none w-32">
                                        <img
                                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/api/placeholder/185/278'}
                                            alt={actor.name}
                                            className="rounded-lg mb-2 w-full h-40 object-cover"
                                            loading="lazy"
                                        />
                                        <p className="font-semibold text-sm">{actor.name}</p>
                                        <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic mt-4">No cast information available.</p>
                        )
                    ) : (
                        <p className="text-gray-500 italic mt-4">Cast is hidden. Click "Show" to view.</p>
                    )}
                </div>

                {/* Similar Titles */}
                <div className="mt-12">
                    <div className="flex justify-between items-center border-t border-gray-700 py-2">
                        <span className="font-bold text-xl text-gray-300">Similar Titles</span>
                        <button
                            className="text-blue-500 font-semibold hover:text-blue-400"
                            onClick={() => {
                                setShowSimilars(prev => !prev);
                                if (!showSimilars) fetchSimilars();
                            }}
                        >
                            {showSimilars ? "Hide" : "Show"}
                        </button>
                    </div>
                    {showSimilars ? (
                        similars.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 mt-4">
                                {similars.map(sim => (
                                    <div
                                        key={sim.id}
                                        className="flex-none w-40 cursor-pointer"
                                        onClick={() => handleViewDetails(sim.id, mediaType as 'movie' | 'tv')}
                                    >
                                        <img
                                            src={sim.poster_path ? `https://image.tmdb.org/t/p/w300${sim.poster_path}` : '/api/placeholder/300/450'}
                                            alt={sim.title || sim.name || 'Unknown'}
                                            className="rounded-lg mb-2 w-full h-60 object-cover"
                                            loading="lazy"
                                        />
                                        <p className="font-semibold text-sm line-clamp-2">{sim.title || sim.name || 'Unknown'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic mt-4">No similar titles available.</p>
                        )
                    ) : (
                        <p className="text-gray-500 italic mt-4">Similar titles are hidden. Click "Show" to view.</p>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    {showReviews ? (
                        <div className="mt-6 space-y-6">
                            {/* Hide Reviews Button */}
                            <div className="flex justify-start mt-12">
                                <button
                                    onClick={() => setShowReviews(false)}
                                    className="border border-gray-500 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors w-full"
                                >
                                    Hide Reviews
                                </button>
                            </div>

                            {/* Add Review Form */}
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                                <div className="space-y-4">
                                    <textarea
                                        placeholder="Share your thoughts..."
                                        className="bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg w-full h-32 resize-none border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        value={newReview.text}
                                        onChange={e => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                                        maxLength={1000}
                                    />
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <label className="text-gray-300 font-medium">Rating:</label>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(10)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                                                            className={`w-6 h-6 ${i < newReview.rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400`}
                                                        >
                                                            <Star className="w-full h-full fill-current" />
                                                        </button>
                                                    ))}
                                                </div>
                                                <span className="text-white font-semibold ml-2">{newReview.rating}/10</span>
                                            </div>
                                            <label className="flex items-center gap-2 text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={newReview.hasSpoilers}
                                                    onChange={e => setNewReview(prev => ({ ...prev, hasSpoilers: e.target.checked }))}
                                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                                                />
                                                Contains Spoilers
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-sm">{newReview.text.length}/1000</span>
                                            <button
                                                onClick={handleAddReview}
                                                disabled={!newReview.text.trim()}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
                                            >
                                                Post Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => {
                                        const userLiked = user && review.likes?.includes(user._id);
                                        const userDisliked = user && review.dislikes?.includes(user._id);


                                        return (
                                            <UserReview
                                                key={review._id}
                                                id={review._id}
                                                initials={review.username?.[0].toUpperCase() ?? "?"}
                                                name={review.username ?? "Unknown"}
                                                timeAgo="just now" // You can replace with formatted timestamp
                                                rating={review.rating}
                                                reviewText={review.reviewText}
                                                helpfulCount={Array.isArray(review.likes) ? review.likes.length : 0}
                                                unhelpfulCount={Array.isArray(review.dislikes) ? review.dislikes.length : 0}
                                                hasSpoiler={review.hasSpoilers}
                                                userLiked={userLiked}
                                                userDisliked={userDisliked}
                                                handleVote={handleVote}
                                            />
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-start mt-12">
                            <button
                                onClick={() => {
                                    setShowReviews(true);
                                    if (reviews.length === 0) fetchReviews();
                                }}
                                className="border border-gray-500 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors w-full"
                            >
                                See Reviews
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
