'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MonitorCheck } from 'lucide-react'
import Link from "next/link";

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setIsLoading(true);
        setErrorMessage('');

        // Basic validation
        if (!email || !username || !password) {
            setErrorMessage("All fields are required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
                credentials: 'include', 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            const data = await response.json();
            
            // Store the token if provided
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            // show success message
            setIsSuccessful(true);

            // hide the loading screen
            setIsLoading(false);

            // Redirect to dashboard
            router.push('/');
        } catch (error: any) {
            console.error('Signup error:', error);
            setErrorMessage(error.message || 'An error occurred during signup');
        }
    };

    return (
        <div className="min-h-screen login-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                        <MonitorCheck />
                        <p className="text-gray-700 font-medium">Account Created! Welcome!</p>
                    </div>
                </div>
            )}

            <div className="login-content">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        BingeBoard
                    </h1>
                    <p className="text-xl text-white/80 drop-shadow-md">
                        Track your movie and TV journey
                    </p>
                </div>

                {/* Glass Signup Box */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="glass-login-box p-8">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center drop-shadow-md">
                            Create Account
                        </h2>

                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm glass-label mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full glass-input px-4 py-3 text-white placeholder-white/70"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Username Field */}
                            <div>
                                <label className="block text-sm glass-label mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="w-full glass-input px-4 py-3 text-white placeholder-white/70"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm glass-label mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full glass-input px-4 py-3 text-white placeholder-white/70"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Signup Button */}
                            <div className="flex items-center flex-col">
                                <button
                                    type="button"
                                    onClick={handleSignup}
                                    className="w-full glass-button py-3 px-4 text-white font-semibold"
                                >
                                    Create Account
                                </button>

                                {errorMessage && (
                                    <p className="text-red-300 text-sm mt-3 bg-red-500/20 px-3 py-2 rounded-md backdrop-blur-sm">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-white/80">
                                Already have an account?{' '}
                                <Link
                                    href="/login" 
                                    className="text-white font-semibold hover:text-white/80 transition-colors underline underline-offset-2"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;