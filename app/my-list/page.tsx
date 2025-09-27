'use client'
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Movie from "../types/Movie";
import PageLoader from "../components/PageLoader";

export default function MyListPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MyListContent />
    </Suspense>
  );
}

function MyListContent() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      const formattedStatus = statusParam
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const validStatuses = ["All", "Watched", "Watching", "Want to Watch", "Dropped"];

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
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

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

  if (loading) return <PageLoader />;

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Watchlist</h1>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Your watchlist is empty</div>
          <p className="text-gray-400">
            Start adding movies and TV shows to build your watchlist!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={`${movie.mediaType}-${movie.id}`} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
