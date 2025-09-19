'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Movie from "../types/Movie";

function MyListPage() {
    const searchParams = useSearchParams();
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check for status query parameter on component mount
        const statusParam = searchParams.get('status');
        if (statusParam) {
            let formattedStatus;
            if (!statusParam) {
                formattedStatus = 'All'
            } else {
                formattedStatus = statusParam.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
            const validStatuses = ['All', 'Watched', 'Watching', 'Want to Watch', 'Dropped'];

            if (validStatuses.includes(formattedStatus)) {
                setStatusFilter(formattedStatus);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchWatchlist() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch("/api/watch_list");

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setMovies(data);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
                setError("Failed to load watchlist. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchWatchlist();
    }, []);

    // Filter movies based on status
    const filteredMovies = movies.filter(movie => {
        if (statusFilter === "All") return true;

        const statusMap = {
            "Watched": "watched",
            "Watching": "watching",
            "Want to Watch": "want_to_watch",
            "Dropped": "dropped"
        };

        return movie.userStatus === statusMap[statusFilter as keyof typeof statusMap];
    });

    // Get counts for each status
    const statusCounts = {
        All: movies.length,
        Watched: movies.filter(m => m.userStatus === "watched").length,
        Watching: movies.filter(m => m.userStatus === "watching").length,
        "Want to Watch": movies.filter(m => m.userStatus === "want_to_watch").length,
        Dropped: movies.filter(m => m.userStatus === "dropped").length,
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-lg text-gray-600">Loading your watchlist...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
                <div className="text-sm text-gray-500">
                    {filteredMovies.length} {filteredMovies.length === 1 ? 'item' : 'items'}
                </div>
            </div>

            {/* Status Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {['All', 'Watched', 'Watching', 'Want to Watch', 'Dropped'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${tab === statusFilter
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab} {statusCounts[tab as keyof typeof statusCounts] > 0 &&
                                `(${statusCounts[tab as keyof typeof statusCounts]})`
                            }
                        </button>
                    ))}
                </nav>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {statusFilter === "All"
                            ? "Your watchlist is empty"
                            : `No ${statusFilter.toLowerCase()} items found`
                        }
                    </div>
                    <p className="text-gray-400">
                        {statusFilter === "All"
                            ? "Start adding movies and TV shows to build your watchlist!"
                            : "Try selecting a different status filter."
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredMovies.map((movie) => (
                        <MovieCard key={`${movie.mediaType}-${movie.id}`} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyListPage;
