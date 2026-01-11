'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, MonitorCheck } from 'lucide-react'
import Link from 'next/link';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            setIsLoading(false);

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed');
                return;
            }

            const data = await response.json();

            // Store the token
            if (data.token) {
                localStorage.setItem('token', data.token);
            } 

            // show success message
            setIsSuccessful(true);

            // hide the loading screen
            setIsLoading(false);

            // Redirect to dashboard
            router.push(`/`);

        } catch (error: any) {
            console.error('Login error:', error);
            setErrorMessage(error.message || 'An error occurred during login');
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Image */}
            <Image
                src="/login_bg.jpg"
                alt="Background"
                fill
                priority
                quality={100}
                className="object-cover"
                sizes="100vw"
            />

            {/* Dark Overlay with Blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl z-[1]" />

            {/* Loading Modal */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-gray-700 font-medium">Loading...</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {isSuccessful && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
                        <MonitorCheck className="h-8 w-8 text-green-600" />
                        <p className="text-gray-700 font-medium">Successful Login</p>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        BingeBoard
                    </h1>
                    <p className="text-xl text-white/80 drop-shadow-md">
                        Track your movie and TV journey
                    </p>
                </div>

                {/* Glass Login Box */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center drop-shadow-md">
                            Welcome Back
                        </h2>

                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Login Button */}
                            <div className="flex items-center flex-col">
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg py-3 px-4 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Sign In
                                </button>

                                {errorMessage && (
                                    <p className="text-red-300 text-sm mt-3 bg-red-500/20 px-3 py-2 rounded-md backdrop-blur-sm border border-red-400/30">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-white/80">
                                Don't have an account?{' '}
                                <Link
                                    href="/signup"
                                    className="text-white font-semibold hover:text-white/80 transition-colors underline underline-offset-2"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
