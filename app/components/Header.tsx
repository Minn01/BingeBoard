'use client'

import { Home, List, Search, User, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LogoutButton from "./LogoutButton";
import { tmdbApi, tmdbToMovie } from "../../lib/tmdb";
import Movie from "../types/Movie";

interface SearchResult extends Movie {
    media_type?: 'movie' | 'tv' | 'person';
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

    // Update current page based on pathname
    useEffect(() => {
        if (pathname === '/') {
            setCurrentPage('dashboard');
        } else if (pathname === '/browse') {
            setCurrentPage('browse');
        } else if (pathname === '/my-list') {
            setCurrentPage('my-list');
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
                    const response = await tmdbApi.searchMulti(searchQuery, 1);
                    const results = response.results
                        .filter((item: any) => item.media_type !== 'person') // Filter out people
                        .slice(0, 8) // Limit to 8 results
                        .map((item: any) => ({
                            ...tmdbToMovie(item),
                            media_type: item.media_type as 'movie' | 'tv'
                        }));
                    setSearchResults(results);
                    setShowSearchResults(true);
                } catch (error) {
                    console.error('Search error:', error);
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
        router.push('/' + (page === 'dashboard' ? '' : page));
    }

    const handleSearchItemClick = (movie: SearchResult) => {
        setShowSearchResults(false);
        setSearchQuery('');
        // You could navigate to a detailed movie page here
        console.log('Selected movie:', movie);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to browse page with search query
            router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearchResults(false);
        }
    };

    return (
        <header className="fixed w-full z-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg">
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

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
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
                                                    '/api/placeholder/46/69'
                                                }
                                                alt={movie.title}
                                                className="w-12 h-16 object-cover rounded flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {movie.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {movie.media_type === 'tv' ? 'TV Show' : 'Movie'} • 
                                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <div className="flex items-center">
                                                        <Search className="w-3 h-3 text-yellow-400 mr-1" />
                                                        <span className="text-xs text-gray-600">
                                                            {movie.vote_average.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {searchQuery.trim() && (
                                        <button
                                            onClick={() => handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent)}
                                            className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-blue-600 font-medium border-t mt-1 pt-3"
                                        >
                                            See all results for "{searchQuery}"
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <nav className="flex space-x-6">
                            <button
                                onClick={() => moveTo('dashboard')}
                                className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${currentPage === 'dashboard' ? 'text-blue-200' : ''}`}
                            >
                                <Home className="w-4 h-4" />
                                <span>Dashboard</span>
                            </button>
                            <button
                                onClick={() => moveTo('browse')}
                                className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${currentPage === 'browse' ? 'text-blue-200' : ''}`}
                            >
                                <Search className="w-4 h-4" />
                                <span>Browse</span>
                            </button>
                            <button
                                onClick={() => moveTo('my-list')}
                                className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${currentPage === 'my-list' ? 'text-blue-200' : ''}`}
                            >
                                <List className="w-4 h-4" />
                                <span>My List</span>
                            </button>
                        </nav>

                        <div className="flex items-center space-x-2">
                            <User className="w-6 h-6" />
                            <span className="font-medium">John</span>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;