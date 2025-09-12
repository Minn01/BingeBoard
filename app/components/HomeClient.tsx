// app/HomeClient.tsx
'use client'

import Movie from "../types/Movie"
import { useState } from "react"
import HeroCarousel from "../components/HeroCarousel"
import MovieCarousel from "../components/MovieCarousel"
import MovieDetail from "../components/MovieDetail"
import { Clock, Eye, Heart, List } from "lucide-react"

const genres: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

type Props = {
  trending: Movie[];
  popularMovies: Movie[];
  popularTvShows: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
};

export default function HomeClient({ trending, popularMovies, popularTvShows, topRated, upcoming }: Props) {
const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Keep your old handlers
  const handleViewDetails = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseDetails = () => setSelectedMovie(null);
  const handlePlayMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleAddToList = (movie: Movie) => alert(`Added "${movie.title}" to your watchlist!`);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Carousel */}
      {trending.length > 0 && (
        <HeroCarousel
          movies={trending}
          onViewDetails={handleViewDetails}
          onPlayMovie={handlePlayMovie}
          onAddToList={handleAddToList}
        />
      )}

      {/* Main Content */}
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

        {/* Movie Carousels */}
        <div className="w-full space-y-8">
          {popularMovies.length > 0 && (
            <MovieCarousel
              title="🍿 Popular Movies"
              movies={popularMovies}
              onViewDetails={handleViewDetails}
              slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
            />
          )}

          {topRated.length > 0 && (
            <MovieCarousel
              title="⭐ Top Rated Movies"
              movies={topRated}
              onViewDetails={handleViewDetails}
              slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
            />
          )}

          {popularTvShows.length > 0 && (
            <MovieCarousel
              title="📺 Popular TV Shows"
              movies={popularTvShows}
              onViewDetails={handleViewDetails}
              slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
            />
          )}

          {upcoming.length > 0 && (
            <MovieCarousel
              title="🎬 Coming Soon"
              movies={upcoming}
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
