'use client'

import { Search, Home, User, X, Loader2, BadgeCheck } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import LogoutButton from "./LogoutButton"

type SearchResult = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    media_type: 'movie' | 'tv' | 'person';
}

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const router = useRouter();
    const pathname = usePathname();
    const searchRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/me`);
                if (!res.ok) {
                    router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/login`);
                    console.log('Not logged in');
                }
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    // Update current page based on pathname
    useEffect(() => {
        setIsNavigating(false);
        if (pathname === `${process.env.NEXT_PUBLIC_BASE_PATH}/` || pathname === '/') {
            setCurrentPage('dashboard');
        } else if (pathname === `${process.env.NEXT_PUBLIC_BASE_PATH}/browse` || pathname === '/browse') {
            setCurrentPage('browse');
        } else if (pathname === `${process.env.NEXT_PUBLIC_BASE_PATH}/my-list` || pathname === '/my-list') {
            setCurrentPage('my-list');
        } else if (pathname === `${process.env.NEXT_PUBLIC_BASE_PATH}/profile` || pathname === 'profile') {
            setCurrentPage('/profile');
        }
    }, [pathname]);

    // Handle search with debouncing
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim().length > 2) {
            setSearchLoading(true);
            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search/multi?query=${encodeURIComponent(searchQuery)}&page=1`);
                    const data = await res.json();

                    const results = (data.results || [])
                        .filter((item: any) => item.media_type !== "person")
                        .slice(0, 8)
                        .map((item: any) => ({
                            id: item.id,
                            title: item.title || item.name,
                            poster_path: item.poster_path,
                            release_date: item.release_date || item.first_air_date,
                            vote_average: item.vote_average || 0,
                            media_type: item.media_type as "movie" | "tv",
                        }));

                    setSearchResults(results);
                    setShowSearchResults(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setSearchResults([]);
                } finally {
                    setSearchLoading(false);
                }
            }, 300);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
            setSearchLoading(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const moveTo = (page: string) => {
        setCurrentPage(page);
        setIsNavigating(true);
        router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/` + (page === 'dashboard' ? '' : page));
    }

    const handleSearchItemClick = (movie: SearchResult) => {
        setIsNavigating(true);
        setShowSearchResults(false);
        setSearchQuery('');
        router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/details/${movie.media_type}/${movie.id}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsNavigating(true);
            router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/browse?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearchResults(false);
            setSearchQuery(''); // Clear the search query after navigation
        }
    };

    return (
        <header className="fixed w-full z-50 bg-playstation-blue text-white shadow-lg">
            {isNavigating && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-gray-700 font-medium">Loading...</p>
                    </div>
                </div>
            )}

            {isSuccessful && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
                        <BadgeCheck className="text-blue-600" />
                        <p className="text-gray-700 font-medium">Logout Successful!</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => moveTo('dashboard')}>
                            BingeBoard
                        </h1>
                    </div>

                    {/* Search Section */}
                    <div className="flex-1 max-w-lg mx-8 relative" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search movies and TV shows..."
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                {searchLoading && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* Search Results Dropdown - Fixed positioning */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="fixed left-1/2 transform -translate-x-1/2 top-[72px] w-full max-w-lg mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-[60]">
                                <div className="p-2">
                                    <div className="text-xs text-gray-500 px-2 py-1 border-b">
                                        Search Results ({searchResults.length})
                                    </div>
                                    {searchResults.map((movie) => (
                                        <div
                                            key={`${movie.id}-${movie.media_type}`}
                                            onClick={() => handleSearchItemClick(movie)}
                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <img
                                                src={movie.poster_path ?
                                                    `https://image.tmdb.org/t/p/w92${movie.poster_path}` :
                                                    '/api/placeholder/92/138'
                                                }
                                                alt={movie.title}
                                                className="w-12 h-16 object-cover rounded flex-shrink-0"
                                                loading="lazy"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {movie.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {movie.media_type === 'movie' ? 'Movie' : 'TV Show'} •{' '}
                                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <Search className="w-3 h-3 text-yellow-500 mr-1" />
                                                    <span className="text-xs text-gray-600">
                                                        {movie.vote_average?.toFixed(1) || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-3">
                        <button
                            onClick={() => moveTo('dashboard')}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'dashboard'
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </button>
                        <button
                            onClick={() => moveTo('browse')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'browse'
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Browse
                        </button>
                        <button
                            onClick={() => moveTo('my-list')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'my-list'
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            My List
                        </button>

                        {/* User Menu */}
                        <div className='flex items-center space-x-4'>
                            <div onClick={() => moveTo('profile')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${currentPage === 'profile'
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}>
                                <User className='w-5 h-5' />
                                <span>
                                    {user ? `Welcome, ${user.username}!` : 'Loading...'}
                                </span>
                            </div>
                            <LogoutButton setIsSuccessful={setIsSuccessful} setIsNavigating={setIsNavigating} />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header