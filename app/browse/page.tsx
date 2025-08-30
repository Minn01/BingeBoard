import { Filter, List, User } from "lucide-react"
import MovieCard from "../components/MovieCard"

const mockMovies = [
    {
        id: 1,
        title: "The Dark Knight",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        release_date: "2008-07-18",
        vote_average: 9.0,
        genre_ids: [28, 18, 80],
        overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and Harvey Dent.",
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
        overview: "A high school chemistry teacher turned methamphetamine producer.",
        userStatus: "watching",
        userRating: null,
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
        overview: "A thief who steals corporate secrets through dream-sharing technology.",
        userStatus: "want_to_watch",
        userRating: null
    }
];

const genres = {
    28: "Action", 18: "Drama", 80: "Crime", 878: "Science Fiction", 53: "Thriller"
};

function BrowsePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
                {/* Filters Sidebar */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                                <option value="">All</option>
                                <option value="movie">Movies</option>
                                <option value="tv">TV Shows</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {Object.values(genres).map(genre => (
                                    <label key={genre} className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="ml-2 text-sm">{genre}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Release Year</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="From"
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="To"
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Browse Movies & TV Shows</h2>
                        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                            <option>Sort by Popularity</option>
                            <option>Sort by Rating</option>
                            <option>Sort by Release Date</option>
                            <option>Sort by Title</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mockMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Previous</button>
                            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">1</button>
                            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">2</button>
                            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">3</button>
                            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Next</button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrowsePage