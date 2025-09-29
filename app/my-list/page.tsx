'use client'
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update status filter from URL params
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      const formattedStatus = statusParam
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const validStatuses = ["All", "Watched", "Watching", "Want To Watch", "Dropped"];

      if (validStatuses.includes(formattedStatus)) {
        setStatusFilter(formattedStatus);
      }
    }
  }, [searchParams]);

  // Fetch watchlist data
  useEffect(() => {
    async function fetchWatchlist() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/watch_list`);
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

  // Filter movies based on status
  const filteredMovies = statusFilter === "All" 
    ? movies 
    : movies.filter(movie => {
        const statusMap: Record<string, string> = {
          "Watched": "watched",
          "Watching": "watching",
          "Want To Watch": "want_to_watch",
          "Dropped": "dropped"
        };
        return movie.userStatus === statusMap[statusFilter];
      });

  // Handle status tab change
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    // Update URL without page reload
    const statusParam = status === "All" ? "" : status.toLowerCase().replace(" ", "_");
    if (statusParam) {
      router.push(`/my-list?status=${statusParam}`, { scroll: false });
    } else {
      router.push(`/my-list`, { scroll: false });
    }
  };

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

      {/* Status Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {['All', 'Watched', 'Watching', 'Want To Watch', 'Dropped'].map(tab => (
            <button
              key={tab}
              onClick={() => handleStatusChange(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                tab === statusFilter
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {tab === "All" 
                  ? movies.length 
                  : movies.filter(m => {
                      const statusMap: Record<string, string> = {
                        "Watched": "watched",
                        "Watching": "watching",
                        "Want To Watch": "want_to_watch",
                        "Dropped": "dropped"
                      };
                      return m.userStatus === statusMap[tab];
                    }).length
                }
              </span>
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
              : `No items in "${statusFilter}"`
            }
          </div>
          <p className="text-gray-400">
            {statusFilter === "All" 
              ? "Start adding movies and TV shows to build your watchlist!"
              : `Try adding some content to your ${statusFilter.toLowerCase()} list!`
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