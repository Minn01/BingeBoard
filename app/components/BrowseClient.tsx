'use client'

import { Filter, Loader2 } from "lucide-react"
import MovieCard from "../components/MovieCard"
import Movie from "../types/Movie"
import MovieDetail from "../components/MovieDetail"
import { useState, useEffect, useCallback } from "react"
import { tmdbApi, tmdbToMovie } from "../../lib/tmdb"

const genres: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

type InitialData = {
  trending: Movie[];
  popularMovies: Movie[];
  popularTVShows: Movie[];
  totalPages: {
    trending: number;
    movies: number;
    tv: number;
  };
};

type Props = {
  initialData: InitialData;
};

// Main Browse Client Component
export default function BrowseClient({ initialData }: Props) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contentType, setContentType] = useState<'all' | 'movie' | 'tv'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'release_date' | 'title'>('popularity');
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Initialize with server data
  useEffect(() => {
    if (!isSearchMode) {
      const getInitialMovies = () => {
        switch (contentType) {
          case 'movie':
            return {
              movies: initialData.popularMovies,
              pages: initialData.totalPages.movies
            };
          case 'tv':
            return {
              movies: initialData.popularTVShows,
              pages: initialData.totalPages.tv
            };
          default:
            return {
              movies: initialData.trending,
              pages: initialData.totalPages.trending
            };
        }
      };

      const { movies: initialMovies, pages } = getInitialMovies();
      const sortedMovies = sortMovies(initialMovies, sortBy);
      setMovies(sortedMovies);
      setTotalPages(pages);
      setCurrentPage(1);
    }
  }, [contentType, sortBy, isSearchMode, initialData]);

  // Fetch movies based on current filters and search
const fetchMovies = useCallback(async (page: number = 1, search: string = '') => {
  setLoading(true);
  try {
    let response;

    if (search.trim()) {
      setIsSearchMode(true);

      // Calling different endpoints based on content type
      let apiUrl = `/api/search`;
      if (contentType === 'movie') {
        apiUrl = `/api/search/movies?query=${encodeURIComponent(search)}&page=${page}`;
      } else if (contentType === 'tv') {
        apiUrl = `/api/search/tv?query=${encodeURIComponent(search)}&page=${page}`;
      } else {
        apiUrl = `/api/search/multi?query=${encodeURIComponent(search)}&page=${page}`;
      }

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch search results");
      response = await res.json();

      const convertedMovies = response.results.map(tmdbToMovie);
      const sortedMovies = sortMovies(convertedMovies, sortBy);

      setMovies(sortedMovies);
      setTotalPages(response.total_pages);
    } else {
      setIsSearchMode(false);
      // Keep your existing logic for browsing without search
      if (page > 1) {
        if (contentType === 'movie') {
          response = await tmdbApi.getPopularMovies(page);
        } else if (contentType === 'tv') {
          response = await tmdbApi.getPopularTVShows(page);
        } else {
          response = await tmdbApi.getTrending('week', page);
        }

        const convertedMovies = response.results.map(tmdbToMovie);
        const sortedMovies = sortMovies(convertedMovies, sortBy);

        setMovies(sortedMovies);
        setTotalPages(response.total_pages);
      }
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    setMovies([]);
  } finally {
    setLoading(false);
  }
}, [contentType, sortBy]);


  const sortMovies = (movieList: Movie[], sortType: string): Movie[] => {
    return [...movieList].sort((a, b) => {
      switch (sortType) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'release_date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
        default:
          return 0; // TMDB already returns by popularity
      }
    });
  };

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        setCurrentPage(1);
        fetchMovies(1, searchQuery);
      } else {
        // Reset to initial server data when search is cleared
        setIsSearchMode(false);
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, fetchMovies]);

  // Handle page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchMovies(currentPage, searchQuery);
    }
  }, [currentPage, fetchMovies, searchQuery]);

  const handleViewDetails = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm rounded ${
                page === currentPage 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies & shows..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select 
                value={contentType}
                onChange={(e) => setContentType(e.target.value as 'all' | 'movie' | 'tv')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="release_date">Release Date</option>
                <option value="title">Title</option>
              </select>
            </div>

            <button 
              onClick={() => {
                if (searchQuery.trim()) {
                  setCurrentPage(1);
                  fetchMovies(1, searchQuery);
                }
              }}
              disabled={!searchQuery.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 contentType === 'all' ? 'Trending Movies & TV Shows' :
                 contentType === 'movie' ? 'Popular Movies' : 'Popular TV Shows'}
              </h2>
              <p className="text-gray-600 mt-1">
                Page {currentPage} of {totalPages} • {movies.length} results
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading movies...</span>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No movies found.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {totalPages > 1 && renderPagination()}
            </>
          )}
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          genres={genres}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}