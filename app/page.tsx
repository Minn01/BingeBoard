import { Eye, Clock, List, Heart } from "lucide-react"
import MovieCard from "./components/MovieCard"
import Movie from "./types/Movie"

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
        overview: "A thief who steals corporate secrets...",
        userStatus: "want_to_watch",
        userRating: null
    }
];

function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {"Tawan"}!</h2>
                <p className="text-gray-600">Continue your movie and TV journey</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <Eye className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Watched</p>
                            <p className="text-2xl font-bold text-gray-900">42</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Watching</p>
                            <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <List className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Want to Watch</p>
                            <p className="text-2xl font-bold text-gray-900">15</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <Heart className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Favorites</p>
                            <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Watching */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Continue Watching</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockMovies.filter(m => m.userStatus === 'watching').map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>

            {/* Trending This Week */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trending This Week</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;