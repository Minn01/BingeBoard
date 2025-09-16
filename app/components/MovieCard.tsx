'use client'
import { Star, Plus, Info } from "lucide-react"
import Movie from "../types/Movie"
import { useRouter } from "next/navigation"

interface MovieCardProps {
    movie: Movie;
    compact?: boolean; // New prop for carousel version
}

function MovieCard({ movie, compact = false }: MovieCardProps) {
    const router = useRouter();

    // TODO: check if this works
    const handleViewDetails = () => {
        router.push(`/details/${movie.mediaType}/${movie.id}`)
    }

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/api/placeholder/300/450';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
            <div className="relative flex-shrink-0">
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />

                {/* Overlay on hover - Changed to show info instead of play */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={
                            () => {
                                console.log(movie);
                                handleViewDetails()
                            }

                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    {movie.userStatus && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${movie.userStatus === 'watched' ? 'bg-green-100/90 text-green-800' :
                                movie.userStatus === 'watching' ? 'bg-blue-100/90 text-blue-800' :
                                    movie.userStatus === 'want_to_watch' ? 'bg-yellow-100/90 text-yellow-800' :
                                        'bg-gray-100/90 text-gray-800'
                            }`}>
                            {movie.userStatus === 'want_to_watch' ? 'Want to Watch' :
                                movie.userStatus.charAt(0).toUpperCase() + movie.userStatus.slice(1)}
                        </span>
                    )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 left-2">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {movie.vote_average.toFixed(1)}
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                {/* Title and Year */}
                <div className="flex-1">
                    <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">{year}</p>
                </div>

                {/* User Rating */}
                {movie.userRating && (
                    <div className="flex items-center mb-2">
                        <span className="text-xs text-gray-500 mr-1">Your rating:</span>
                        <Star className="w-3 h-3 fill-blue-400 text-blue-400 mr-1" />
                        <span className="text-sm font-medium">{movie.userRating}</span>
                    </div>
                )}

                {/* Progress Bar for TV Shows */}
                {movie.episodesWatched && movie.totalEpisodes && (
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{movie.episodesWatched}/{movie.totalEpisodes}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${(movie.episodesWatched / movie.totalEpisodes) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                    <button
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                        onClick={handleViewDetails}
                    >
                        <Info className="w-4 h-4" />
                        <span>Details & Review</span>
                    </button>
                    <button
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Add to Watchlist"
                    >
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieCard