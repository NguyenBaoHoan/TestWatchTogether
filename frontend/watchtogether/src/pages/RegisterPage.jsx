/**
 * 📝 RegisterPage.jsx
 * 
 * Trang Register với UI hiện đại
 * - Glass morphism background (giống LoginPage)
 * - Responsive design
 * - Auto redirect sau khi register thành công
 * - Link quay về Home và Login
 * - Decorative elements
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '../components/features/RegisterForm';

// Logo Component (giống Header và LoginPage)
const Logo = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#FBBF24" />
        <path d="M8 9.5L13 12L8 14.5V9.5Z" fill="white" />
        <path d="M16 9.5L11 12L16 14.5V9.5Z" fill="white" fillOpacity="0.7" />
    </svg>
);

export default function RegisterPage() {
    const navigate = useNavigate();

    // ============================================
    // ✅ HANDLE REGISTER SUCCESS
    // ============================================
    const handleRegisterSuccess = () => {
        console.log('✅ Registration successful, redirecting to home...');
        // Redirect về trang chủ sau khi register thành công
        // User đã được auto-login sau khi register (backend set JWT cookie)
        navigate('/', { replace: true });
    };

    // ============================================
    // 🔐 HANDLE SWITCH TO LOGIN
    // ============================================
    const handleSwitchToLogin = () => {
        console.log('Switching to login page...');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
            {/* Back to Home Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 flex items-center text-white hover:text-yellow-400 transition-colors group z-20"
            >
                <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                <span className="font-medium">Back to Home</span>
            </button>

            {/* Logo - Top Center */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center z-20">
                <Logo />
                <span className="ml-3 text-white text-2xl font-bold">Watch Together</span>
            </div>

            {/* Register Card with Glass Morphism */}
            <div className="w-full max-w-md z-10">
                <div className="bg-blue-950/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 md:p-10">
                    <RegisterForm
                        onSuccess={handleRegisterSuccess}
                        onSwitchToLogin={handleSwitchToLogin}
                    />
                </div>

                {/* Footer Note */}
                <p className="mt-6 text-center text-sm text-gray-400">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-yellow-400 hover:text-yellow-300">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-yellow-400 hover:text-yellow-300">Privacy Policy</a>
                </p>
            </div>

            {/* Decorative Elements - giống LoginPage nhưng màu khác */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
