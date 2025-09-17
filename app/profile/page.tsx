// app/profile/page.tsx
'use client'
import { useEffect, useState } from "react";
import { User, Calendar, Heart, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Movie from "../types/Movie";

interface UserProfile {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    avatar?: string;
}

function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch user profile using your existing /api/me endpoint
                const profileRes = await fetch("/api/me");
                
                if (profileRes.status === 401) {
                    // User not authenticated, redirect to login
                    router.push('/login');
                    return;
                }
                
                if (!profileRes.ok) {
                    throw new Error(`Failed to fetch profile: ${profileRes.status}`);
                }
                
                const profileData = await profileRes.json();
                console.log("Profile data received:", profileData); // Debug log
                
                // Your API returns { user: {...} }, so extract the user object
                const userData = profileData.user;
                setProfile({
                    id: userData._id,
                    username: userData.username,
                    email: userData.email,
                    createdAt: userData.createdAt,
                    avatar: userData.avatar || null,
                });

                // Fetch favorites
                setFavoritesLoading(true);
                const favoritesRes = await fetch("/api/favorites");
                
                if (favoritesRes.status === 401) {
                    router.push('/login');
                    return;
                }
                
                if (!favoritesRes.ok) {
                    throw new Error(`Failed to fetch favorites: ${favoritesRes.status}`);
                }
                
                const favoritesData = await favoritesRes.json();
                setFavorites(favoritesData);
                
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError(err instanceof Error ? err.message : "Failed to load profile data");
            } finally {
                setLoading(false);
                setFavoritesLoading(false);
            }
        }

        fetchProfileData();
    }, [router]);

    // Generate avatar initials (with null check)
    const getAvatarInitials = (username: string | undefined) => {
        if (!username) return "U"; // Default fallback
        
        return username
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">
                        {error || "Profile not found"}
                    </div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                    >
                        Retry
                    </button>
                    <button 
                        onClick={() => router.push('/login')} 
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={profile.username}
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-200">
                                <span className="text-2xl font-bold text-white">
                                    {getAvatarInitials(profile?.username)}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {profile?.username || "User"}
                        </h1>
                        <p className="text-gray-600 mb-3">{profile?.email || ""}</p>
                        
                        <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm mb-4">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Member since {profile?.createdAt ? formatDate(profile.createdAt) : "Unknown"}</span>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Heart className="w-6 h-6 text-red-500 mr-3 fill-current" />
                        <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
                    </div>
                    <div className="text-sm text-gray-500">
                        {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
                    </div>
                </div>

                {favoritesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading favorites...</span>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">No favorites yet</div>
                        <p className="text-gray-400 text-sm">
                            Start adding movies and shows to your favorites to see them here!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {favorites.map((movie) => (
                            <MovieCard key={`${movie.mediaType}-${movie.id}`} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
