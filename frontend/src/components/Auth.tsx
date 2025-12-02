import { useState } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

interface AuthProps {
    onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await authAPI.login(formData.username, formData.password);
            } else {
                await authAPI.register(formData.email, formData.username, formData.password);
                await authAPI.login(formData.username, formData.password);
            }
            onAuthSuccess();
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <h1 className="auth-logo">
                            <span className="logo-icon">🥗</span>
                            <span className="text-gradient">Nutricam</span>
                        </h1>
                        <p className="auth-subtitle">
                            AI-Powered Nutrition Tracking
                        </p>
                    </div>

                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="input-group">
                                <label className="input-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="input-field"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="auth-error">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    {isLogin ? 'Logging in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>{isLogin ? 'Login' : 'Create Account'}</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                className="auth-switch-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="auth-features">
                    <div className="feature-item animate-fadeIn">
                        <div className="feature-icon">📸</div>
                        <h3>Instant Recognition</h3>
                        <p>Snap a photo and get instant nutrition info</p>
                    </div>
                    <div className="feature-item animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>Monitor your daily nutrition intake</p>
                    </div>
                    <div className="feature-item animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="feature-icon">🎯</div>
                        <h3>Reach Goals</h3>
                        <p>Achieve your health and fitness targets</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
