'use client'

import Movie from "../types/Movie"
import MovieCard from "../components/MovieCard"

const mockMovies: Movie[] = [
];

const genres: { [key: number]: string } = {
    28: "Action", 18: "Drama", 80: "Crime", 878: "Science Fiction", 53: "Thriller"
};

function MyListPage() {
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
                    />
                ))}
            </div>
        </div>
    )
}

export default MyListPage