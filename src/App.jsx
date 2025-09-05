import React, { useState } from 'react';

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
        <div className="auth-container">
            <div className="auth-card">
                {/* Left side with the form */}
                <div className="auth-card-form">
                    <h1 className="title">Sign In</h1>
                    <form onSubmit={handleAuthAction} className="form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                            <span className="icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? eyeSlashIcon : eyeIcon}
                            </span>
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <a href="#" className="forgot-password">
                            Forgot Password?
                        </a>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mobile-switch-btn-container">
                        <h2 className="title">Create Account</h2>
                        <p className="text">
                            Sign up if you still don't have an account.
                        </p>
                        <button
                            onClick={() => setIsLogin(false)}
                            className="mobile-switch-btn"
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Right side with the image - hidden on small screens */}
                <div className="auth-card-image">
                    <div className="flex flex-col items-center text-center p-8">
                        <h2 className="title">Create Account</h2>
                        <p className="text">
                            Sign up if you still don't have an account.
                        </p>
                        <button
                            onClick={() => setIsLogin(false)}
                            className="btn"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const createAccountPage = (
        <div className="auth-container">
            <div className="auth-card">
                {/* Left side with the form */}
                <div className="auth-card-form">
                    <h1 className="title">Create Account</h1>
                    <form onSubmit={handleAuthAction} className="form">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Student Number"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            className="input"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                            <span className="icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? eyeSlashIcon : eyeIcon}
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input"
                        />
                        {error && <p className="error-text">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Loading...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="switch-link">
                        Already have an account?{' '}
                        <a href="#" onClick={() => setIsLogin(true)}>
                            Sign In
                        </a>
                    </p>
                </div>

                {/* Right side with the image - hidden on small screens */}
                <div className="auth-card-image">
                    <div className="flex flex-col items-center text-center p-8">
                        <h2 className="title">Sign In</h2>
                        <p className="text">
                            Please enter your details
                        </p>
                        <button
                            onClick={() => setIsLogin(true)}
                            className="btn"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return isLogin ? signInPage : createAccountPage;
};

export default App;

