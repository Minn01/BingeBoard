'use client'

import { Star } from "lucide-react"
import Movie from "../types/Movie"
import StarRating from './StarRating'

type MovieDetailProps = {
    movie: Movie & { genre_ids: number[] }; // Assuming genre_ids is part of the movie object
    genres: { [key: number]: string }; // Mapping of genre IDs to genre names
    onClose: () => void; // Add onClose handler
}

function MovieDetail({ movie, genres, onClose }: MovieDetailProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 z-10"
                    >
                        ×
                    </button>
                    <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}` : '/api/placeholder/800/400'}
                        alt={movie.title}
                        className="w-full h-64 object-cover"
                    />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h2>
                            <p className="text-gray-600">{new Date(movie.release_date).getFullYear()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{movie.vote_average}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {movie.genre_ids.map(genreId => (
                            <span key={genreId} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                {genres[genreId]}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{movie.overview}</p>

                    {/* User Actions */}
                    <div className="border-t pt-6">
                        <h3 className="font-bold text-gray-900 mb-4">Your Rating & Status</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                                <option value="">Add to list...</option>
                                <option value="want_to_watch">Want to Watch</option>
                                <option value="watching">Currently Watching</option>
                                <option value="watched">Watched</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                            <StarRating rating={movie.userRating || 0} interactive={true} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Share your thoughts about this movie/show..."
                            />
                            <div className="mt-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-2 text-sm text-gray-600">Contains spoilers</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                Save
                            </button>
                            <button className="border border-gray-300 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                                Add to Favorites
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail