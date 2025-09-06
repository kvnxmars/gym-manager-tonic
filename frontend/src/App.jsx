import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isLogin) {
            // For front-end only, we can just log the login attempt
            console.log('Login attempted with:', email, password);
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }
            // For front-end only, we log the creation attempt and form data
            console.log('Account creation attempted with:', { name, surname, studentNumber, email, password });
        }
        setLoading(false);
    };

    const eyeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const eyeSlashIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7a9.957 9.957 0 011.875.175M16.5 16.5L22 22M2 2l20 20M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const signInPage = (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4">
            <div className="w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden md:flex bg-white">
                {/* Left side with the form */}
                <div className="flex-1 p-8 md:p-16 flex flex-col items-center text-center bg-gray-50">
                    <h1 className="text-4xl font-bold mb-2">Sign In</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Please enter your details
                    </p>
                    <form onSubmit={handleAuthAction} className="w-full max-w-sm flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors pr-10"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? eyeSlashIcon : eyeIcon}
                            </span>
                        </div>
                        {error && <p className="text-red-500 text-sm text-left">{error}</p>}
                        <a href="#" className="text-sm text-gray-500 text-right hover:text-indigo-500 transition-colors">
                            Forgot Password?
                        </a>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl border-none cursor-pointer transition-colors hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-8 md:hidden flex flex-col items-center text-center">
                        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                        <p className="text-gray-600">
                            Sign up if you still don't have an account.
                        </p>
                        <button
                            onClick={() => setIsLogin(false)}
                            className="mt-4 px-6 py-3 border-2 border-indigo-600 bg-white text-indigo-600 font-semibold rounded-xl cursor-pointer transition-all hover:bg-indigo-600 hover:text-white"
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Right side with the image - hidden on small screens */}
                <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white justify-center items-center text-center p-8">
                    <div className="flex flex-col items-center text-center p-8">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-lg opacity-90 mb-4">
                            Sign up if you still don't have an account.
                        </p>
                        <button
                            onClick={() => setIsLogin(false)}
                            className="px-6 py-3 border-2 border-white bg-transparent text-white font-semibold rounded-xl cursor-pointer transition-all hover:bg-white hover:text-indigo-600"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const createAccountPage = (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4">
            <div className="w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden md:flex bg-white">
                {/* Left side with the form */}
                <div className="flex-1 p-8 md:p-16 flex flex-col items-center text-center bg-gray-50">
                    <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                    <form onSubmit={handleAuthAction} className="w-full max-w-sm flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Student Number"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors pr-10"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? eyeSlashIcon : eyeIcon}
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        {error && <p className="text-red-500 text-sm text-left">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl border-none cursor-pointer transition-colors hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="#" onClick={() => setIsLogin(true)} className="text-indigo-600 font-semibold hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>

                {/* Right side with the image - hidden on small screens */}
                <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white justify-center items-center text-center p-8">
                    <div className="flex flex-col items-center text-center p-8">
                        <h2 className="text-3xl font-bold mb-2">Sign In</h2>
                        <p className="text-lg opacity-90 mb-4">
                            Please enter your details
                        </p>
                        <button
                            onClick={() => setIsLogin(true)}
                            className="px-6 py-3 border-2 border-white bg-transparent text-white font-semibold rounded-xl cursor-pointer transition-all hover:bg-white hover:text-indigo-600"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isLogin ? signInPage : createAccountPage}
        </>
    );
};

const container = document.getElementById('root');
if (!container) {
    const newContainer = document.createElement('div');
    newContainer.id = 'root';
    document.body.appendChild(newContainer);
    createRoot(newContainer).render(<App />);
} else {
    createRoot(container).render(<App />);
}

export default App;
