'use client'
import { useEffect, useState } from "react";
import { User, Calendar, Heart, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import MovieCard from "../components/MovieCard";
import Movie from "../types/Movie";

type UserProfile = {
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
    
    // Delete account states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            setError(null);
            
            try {
                // Fetch user profile using your existing /api/me endpoint
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/me`);
                
                if (profileRes.status === 401) {
                    router.push('/login');
                    return;
                }
                
                if (!profileRes.ok) {
                    throw new Error(`Failed to fetch profile: ${profileRes.status}`);
                }
                
                const profileData = await profileRes.json();
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
                const favoritesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/favorites`);
                
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

    const getAvatarInitials = (username: string | undefined) => {
        if (!username) return "U";
        return username
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/logout`, { method: 'POST' });
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleDeleteAccount = async () => {
        // Check if user typed their username correctly
        if (deleteConfirmation !== profile?.username) {
            setDeleteError("Username does not match. Please type your username correctly.");
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch('/api/users/account', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete account');
            }

            // Account deleted successfully, logout and redirect
            await fetch('/api/logout', { method: 'POST' });
            router.push('/login?deleted=true');
            
        } catch (err) {
            console.error('Delete account error:', err);
            setDeleteError(err instanceof Error ? err.message : "Failed to delete account");
            setIsDeleting(false);
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
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">
                                    {getAvatarInitials(profile.username)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {profile.username}
                        </h1>
                        <p className="text-gray-600 mb-4">{profile.email}</p>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Joined {formatDate(profile.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-2" />
                                <span>{favorites.length} Favorites</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                        
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h2>
                
                {favoritesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading favorites...</span>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No favorites yet</p>
                        <p className="text-gray-400 mt-2">Start adding movies and shows to your favorites!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                            <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                This action cannot be undone. This will permanently delete your account and remove all your data including:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                                <li>Your watchlist and tracking history</li>
                                <li>All your reviews and ratings</li>
                                <li>Your favorites and preferences</li>
                                <li>Your profile information</li>
                            </ul>
                            <p className="text-gray-700 font-semibold mb-2">
                                Please type <span className="text-red-600">{profile.username}</span> to confirm:
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Type your username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                disabled={isDeleting}
                            />
                            
                            {deleteError && (
                                <p className="text-red-600 text-sm mt-2">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation("");
                                    setDeleteError(null);
                                }}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting || deleteConfirmation !== profile.username}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;