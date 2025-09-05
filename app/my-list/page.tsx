'use client'

import Movie from "../types/Movie"
import MovieCard from "../components/MovieCard"
import MovieDetail from "../components/MovieDetail"
import { useState } from "react"

const mockMovies: Movie[] = [
    {
        id: 1,
        title: "The Dark Knight",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        release_date: "2008-07-18",
        vote_average: 9.0,
        genre_ids: [28, 18, 80],
        overview: "Batman raises the stakes...",
        userStatus: "watched",
        userRating: 9
    },
    {
        id: 2,
        title: "Breaking Bad",
        poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        release_date: "2008-01-20",
        vote_average: 9.5,
        genre_ids: [18, 80],
        overview: "A high school chemistry teacher...",
        userStatus: "watching",
        userRating: undefined,
        episodesWatched: 15,
        totalEpisodes: 62
    },
    {
        id: 3,
        title: "Inception",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        release_date: "2010-07-16",
        vote_average: 8.8,
        genre_ids: [28, 878, 53],
        overview: "A thief who steals corporate secrets...",
        userStatus: "want_to_watch",
        userRating: undefined
    }
];

const genres: { [key: number]: string } = {
    28: "Action", 18: "Drama", 80: "Crime", 878: "Science Fiction", 53: "Thriller"
};

function MyListPage() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleViewDetails = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseDetails = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Watchlist</h2>

            {/* Status Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                    {['All', 'Watched', 'Watching', 'Want to Watch'].map(tab => (
                        <button
                            key={tab}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${tab === 'All'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockMovies.map(movie => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        onViewDetails={handleViewDetails}
                    />
                ))}
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
    )
}

export default MyListPage