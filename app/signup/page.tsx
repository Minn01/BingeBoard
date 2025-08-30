'use client';

function SignUpPage() {
    const handleSignup = async () => {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ username, password }), // Add actual signup data here later
        });

        if (res.ok) {
            // Redirect to home page on successful login
            window.location.href = '/';
        } else {
            window.alert("an error occurred during calling signup endpoint");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">BingeBoard</h1>
                    <p className="text-blue-200">Track your movie and TV journey</p>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSignup}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?
                            <a href='/login' className="text-blue-600 hover:text-blue-500 ml-1 font-medium cursor-pointer">
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
        // <div className="flex justify-center items-center h-screen flex-col gap-4">
        //     <h1>This is the signup page</h1>
        //     <a href="/login">Press here to login</a>
        
        //     {/* this should later be moved to a different file */}
        //     <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        //         onClick={handleSignup}>
        //         Press here to go to home
        //     </button>
        // </div>
}

export default SignUpPage;