'use client'

import { Eye, Clock, List, Heart, Loader2 } from "lucide-react"
import MovieCarousel from "./components/MovieCarousel"
import HeroCarousel from "./components/HeroCarousel"
import Movie from "./types/Movie"
import MovieDetail from "./components/MovieDetail"
import { useState, useEffect } from "react"
import { tmdbApi, tmdbToMovie } from "../lib/tmdb"

const genres: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

function Home() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Handler functions - MUST be defined before using them
    const handleViewDetails = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseDetails = () => {
        setSelectedMovie(null);
    };

    const handlePlayMovie = (movie: Movie) => {
        console.log('Playing movie:', movie.title);
        // For now, just open the movie details
        setSelectedMovie(movie);
    };

    const handleAddToList = (movie: Movie) => {
        console.log('Adding to list:', movie.title);
        alert(`Added "${movie.title}" to your watchlist!`);
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch multiple datasets in parallel for richer content
                const [
                    trendingResponse, 
                    moviesResponse, 
                    tvResponse, 
                    topRatedResponse,
                    upcomingResponse
                ] = await Promise.all([
                    tmdbApi.getTrending('week', 1),
                    tmdbApi.getPopularMovies(1),
                    tmdbApi.getPopularTVShows(1),
                    tmdbApi.fetchFromTMDB('/movie/top_rated?page=1'),
                    tmdbApi.fetchFromTMDB('/movie/upcoming?page=1')
                ]);

                // Convert and set results - get more for better carousels
                setTrendingMovies(trendingResponse.results.slice(0, 20).map(tmdbToMovie));
                setPopularMovies(moviesResponse.results.slice(0, 20).map(tmdbToMovie));
                setPopularTVShows(tvResponse.results.slice(0, 20).map(tmdbToMovie));
                setTopRatedMovies(topRatedResponse.results.slice(0, 20).map(tmdbToMovie));
                setUpcomingMovies(upcomingResponse.results.slice(0, 20).map(tmdbToMovie));
            } catch (error) {
                console.error('Error fetching home data:', error);
                setError('Failed to load content. Please check your TMDB API key.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600 mt-4">Loading your personalized content...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-semibold">Unable to load content</h3>
                    <p className="text-red-600 mt-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-hidden">
            {/* Hero Carousel - Full width */}
            {trendingMovies.length > 0 ? (
                <HeroCarousel
                    movies={trendingMovies}
                    onViewDetails={handleViewDetails}
                    onPlayMovie={handlePlayMovie}
                    onAddToList={handleAddToList}
                />
            ) : (
                <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gray-200 flex items-center justify-center mb-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading hero content...</span>
                </div>
            )}

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Tawan!</h2>
                    <p className="text-gray-600">Continue your movie and TV journey</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <Eye className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Watched</p>
                                <p className="text-2xl font-bold text-gray-900">42</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Watching</p>
                                <p className="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <List className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Want to Watch</p>
                                <p className="text-2xl font-bold text-gray-900">15</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-red-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Favorites</p>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Movie Carousels - Fixed width containers */}
                <div className="w-full space-y-8">
                    {/* Popular Movies */}
                    {popularMovies.length > 0 && (
                        <MovieCarousel
                            title="🍿 Popular Movies"
                            movies={popularMovies}
                            onViewDetails={handleViewDetails}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}

                    {/* Top Rated Movies */}
                    {topRatedMovies.length > 0 && (
                        <MovieCarousel
                            title="⭐ Top Rated Movies"
                            movies={topRatedMovies}
                            onViewDetails={handleViewDetails}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}

                    {/* Popular TV Shows */}
                    {popularTVShows.length > 0 && (
                        <MovieCarousel
                            title="📺 Popular TV Shows"
                            movies={popularTVShows}
                            onViewDetails={handleViewDetails}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}

                    {/* Upcoming Movies */}
                    {upcomingMovies.length > 0 && (
                        <MovieCarousel
                            title="🎬 Coming Soon"
                            movies={upcomingMovies}
                            onViewDetails={handleViewDetails}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
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

export default Home;