'use client'

import Movie from "../types/Movie"
import UserStats from "../types/UserStats"
import { useState, useEffect } from "react"
import HeroCarousel from "../components/HeroCarousel"
import MovieCarousel from "../components/MovieCarousel"
import { Clock, Eye, Heart, List } from "lucide-react"
import { useRouter } from "next/navigation"


type HomePageProps = {
    trending: Movie[];
    popularMovies: Movie[];
    popularTvShows: Movie[];
    topRated: Movie[];
    upcoming: Movie[];
};

export default function HomeClient({ trending, popularMovies, popularTvShows, topRated, upcoming }: HomePageProps) {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [stats, setStats] = useState<UserStats>({
        watched: 0,
        watching: 0,
        wantToWatch: 0,
        favorites: 0,
        total: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const handleSetFavorite = async (movie: Movie) => {
        try {
            const response = await fetch('/api/interactions/set_favorite', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tmdbId: movie.id,
                    mediaType: movie.mediaType,
                    isFavorite: true
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Redirect to login or show auth modal
                    window.location.href = '/login';
                    return;
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            window.alert("Added to favorites")
            // Show success message 
            console.log(result.message);

        } catch {

        }
    }

    useEffect(() => {
        const fetchUserAndStats = async () => {
            try {
                // Fetch user info
                const userRes = await fetch('/api/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData.user);

                    // Fetch user stats
                    setStatsLoading(true);
                    const statsRes = await fetch('/api/stats');
                    if (statsRes.ok) {
                        const statsData = await statsRes.json();
                        setStats(statsData);
                    } else {
                        console.error('Failed to fetch stats');
                    }
                } else {
                    console.log('User not logged in');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchUserAndStats();
    }, []);

    const navigateToWatchlist = (status?: string) => {
        if (status) {
            router.push(`/my-list?status=${status.toLowerCase().replace(/ /g, '_')}`);
        } else {
            router.push('/my-list');
        }
    };

    const navigateToProfile = () => {
        router.push('/profile');
    };

    return (
        <div className="w-full overflow-x-hidden">
            {/* Hero Carousel */}
            {trending.length > 0 && (
                <HeroCarousel
                    movies={trending}
                    onAddToList={handleSetFavorite}
                />
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome{user ? `, ${user.username}` : ''}!
                    </h2>
                    <p className="text-gray-600">Continue your movie and TV journey</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div onClick={() => { navigateToWatchlist('Watched') }}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <Eye className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Watched</p>
                                {statsLoading ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">{stats.watched}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div onClick={() => { navigateToWatchlist('Watching') }}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Watching</p>
                                {statsLoading ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">{stats.watching}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div onClick={() => { navigateToWatchlist('Watching') }}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <List className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Want to Watch</p>
                                {statsLoading ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">{stats.wantToWatch}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div onClick={navigateToProfile}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-red-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Favorites</p>
                                {statsLoading ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                                )}
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
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}

                    {topRated.length > 0 && (
                        <MovieCarousel
                            title="⭐ Top Rated Movies"
                            movies={topRated}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}

                    {popularTvShows.length > 0 && (
                        <MovieCarousel
                            title="📺 Popular TV Shows"
                            movies={popularTvShows}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}

                    {upcoming.length > 0 && (
                        <MovieCarousel
                            title="🎬 Coming Soon"
                            movies={upcoming}
                            slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 4.5 }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}