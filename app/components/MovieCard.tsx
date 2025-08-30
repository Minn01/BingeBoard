'use client'
import { Star, Plus } from "lucide-react"
import Movie from "../types/Movie"

function MovieCard({ movie }: MovieCardProps) { 
   return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
                <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/api/placeholder/300/450'}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                />
                <div className="absolute top-2 right-2">
                    {movie.userStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${movie.userStatus === 'watched' ? 'bg-green-100 text-green-800' :
                                movie.userStatus === 'watching' ? 'bg-blue-100 text-blue-800' :
                                    movie.userStatus === 'want_to_watch' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                            }`}>
                            {movie.userStatus === 'want_to_watch' ? 'Want to Watch' :
                                movie.userStatus.charAt(0).toUpperCase() + movie.userStatus.slice(1)}
                        </span>
                    )}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{new Date(movie.release_date).getFullYear()}</p>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{movie.vote_average}</span>
                    </div>
                    {movie.userRating && (
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">You:</span>
                            <Star className="w-3 h-3 fill-blue-400 text-blue-400 mr-1" />
                            <span className="text-sm">{movie.userRating}</span>
                        </div>
                    )}
                </div>
                {movie.episodesWatched && (
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{movie.episodesWatched}/{movie.totalEpisodes}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(movie.episodesWatched / movie.totalEpisodes) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                <div className="flex gap-2">
                    <button
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        onClick={() => {}}
                    >
                        View Details
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
   )  
}

interface MovieCardProps {
    movie: Movie;
}

export default MovieCard