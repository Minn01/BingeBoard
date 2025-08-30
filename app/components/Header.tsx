'use client'

import { Home, List, LogOut, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

function Header() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState('dashboard') 
    const router = useRouter();

    const moveTo = (page: string) => {
        setCurrentPage(page);
        router.push('/' + (page === 'dashboard' ? '' : page));
    }

    return (
        <header className="fixed w-screen z-10 bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">BingeBoard</h1>
                    </div>

                    <div className="flex-1 max-w-lg mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movies and TV shows..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <nav className="flex space-x-6">
                            <button
                                onClick={() => moveTo('dashboard')}
                                className={`flex items-center space-x-1 hover:text-blue-200 ${currentPage === 'dashboard' ? 'text-blue-200' : ''}`}
                            >
                                <Home className="w-4 h-4" />
                                <span>Dashboard</span>
                            </button>
                            <button
                                onClick={() => moveTo('browse')}
                                className={`flex items-center space-x-1 hover:text-blue-200 ${currentPage === 'browse' ? 'text-blue-200' : ''}`}
                            >
                                <Search className="w-4 h-4" />
                                <span>Browse</span>
                            </button>
                            <button
                                onClick={() => moveTo('my-list')}
                                className={`flex items-center space-x-1 hover:text-blue-200 ${currentPage === 'my-list' ? 'text-blue-200' : ''}`}
                            >
                                <List className="w-4 h-4" />
                                <span>My List</span>
                            </button>
                        </nav>

                        <div className="flex items-center space-x-2">
                            <User className="w-6 h-6" />
                            <span className="font-medium">{"John"}</span>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;