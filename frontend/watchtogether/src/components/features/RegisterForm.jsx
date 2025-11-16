/**
 * 📝 RegisterForm.jsx
 * 
 * Form component hiện đại cho Registration
 * 
 * Features:
 * - Real-time validation với nhiều rules phức tạp
 * - Password strength meter (yếu/trung bình/mạnh)
 * - Confirm password matching
 * - Password show/hide toggle
 * - Terms & conditions checkbox
 * - Loading states
 * - Error messages
 * - Social register buttons
 * - Responsive design
 * - Glass morphism UI
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader, Github, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
// Không cần import socialLogin nữa vì chưa implement

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
    // ============================================
    // 📝 FORM STATE
    // ============================================
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

    const { register } = useAuth();

    // ============================================
    // 💪 PASSWORD STRENGTH CALCULATOR
    // ============================================
    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (!password) return { score: 0, text: '', color: '' };

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password)) score++; // lowercase
        if (/[A-Z]/.test(password)) score++; // uppercase
        if (/[0-9]/.test(password)) score++; // numbers
        if (/[^A-Za-z0-9]/.test(password)) score++; // special chars

        // Determine strength
        if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, text: 'Medium', color: 'bg-yellow-500' };
        return { score, text: 'Strong', color: 'bg-green-500' };
    };

    // Update password strength khi password thay đổi
    useEffect(() => {
        const strength = calculatePasswordStrength(formData.password);
        setPasswordStrength(strength);
    }, [formData.password]);

    // ============================================
    // 📝 INPUT CHANGE HANDLER
    // ============================================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error khi user bắt đầu sửa
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) setServerError('');
    };

    // ============================================
    // ✅ VALIDATION
    // ============================================
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Name must not exceed 50 characters';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation - phức tạp hơn login
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const issues = [];
            if (formData.password.length < 8) issues.push('at least 8 characters');
            if (!/[a-z]/.test(formData.password)) issues.push('one lowercase letter');
            if (!/[A-Z]/.test(formData.password)) issues.push('one uppercase letter');
            if (!/[0-9]/.test(formData.password)) issues.push('one number');
            if (!/[^A-Za-z0-9]/.test(formData.password)) issues.push('one special character');

            if (issues.length > 0) {
                newErrors.password = `Password must contain ${issues.join(', ')}`;
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Terms validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============================================
    // 📤 FORM SUBMIT
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        // Validate form
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            // Success - redirect hoặc callback
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setServerError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================
    // 🌐 SOCIAL REGISTER
    // ============================================
    const handleSocialRegister = (provider) => {
        // TODO: Implement social login redirect
        const baseURL = 'http://localhost:8080/api/v1';
        window.location.href = `${baseURL}/auth/social/${provider}`;
    };

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-300">Join us and start watching together</p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm flex items-start">
                    <XCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} />
                    <span>{serverError}</span>
                </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-gray-600'
                                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                            placeholder="John Doe"
                            autoComplete="name"
                            autoFocus
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <XCircle size={14} className="mr-1" />
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                            placeholder="your@email.com"
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <XCircle size={14} className="mr-1" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Input with Strength Meter */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Strength Meter */}
                    {formData.password && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-400">Password strength:</span>
                                <span className={`text-xs font-semibold ${passwordStrength.score <= 2 ? 'text-red-400' :
                                    passwordStrength.score <= 4 ? 'text-yellow-400' :
                                        'text-green-400'
                                    }`}>
                                    {passwordStrength.text}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400 flex items-start">
                            <XCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                            <span>{errors.password}</span>
                        </p>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' :
                                formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' :
                                    'border-gray-600'
                                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {/* Match indicator */}
                        {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                            <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                        )}
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <XCircle size={14} className="mr-1" />
                            {errors.confirmPassword}
                        </p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                        <p className="mt-1 text-sm text-green-400 flex items-center">
                            <CheckCircle size={14} className="mr-1" />
                            Passwords match
                        </p>
                    )}
                </div>

                {/* Terms & Conditions */}
                <div>
                    <label className="flex items-start cursor-pointer">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className={`w-4 h-4 mt-1 rounded border-gray-600 bg-white/10 text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer ${errors.agreeToTerms ? 'border-red-500' : ''
                                }`}
                        />
                        <span className="ml-2 text-sm text-gray-300">
                            I agree to the{' '}
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 underline">
                                Terms of Service
                            </a>
                            {' '}and{' '}
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 underline">
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                    {errors.agreeToTerms && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <XCircle size={14} className="mr-1" />
                            {errors.agreeToTerms}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <Loader className="animate-spin mr-2" size={20} />
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-sm text-gray-400">or sign up with</span>
                <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Social Register Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => handleSocialRegister('google')}
                    className="flex items-center justify-center px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialRegister('github')}
                    className="flex items-center justify-center px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                    <Github className="mr-2" size={20} />
                    GitHub
                </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
                <p className="text-gray-300">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}
