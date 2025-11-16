import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// SVG for the logo
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
    <rect width="24" height="24" rx="6" fill="#FBBF24" />
    <path d="M8 9.5L13 12L8 14.5V9.5Z" fill="white" />
    <path d="M16 9.5L11 12L16 14.5V9.5Z" fill="white" fillOpacity="0.7" />
  </svg>
);

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 py-4 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Site Name */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Logo />
          <span className="text-white text-2xl font-bold">Watch Together</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-white">
          <a href="#" className="hover:text-gray-300 transition-colors">Community</a>
          <a href="#" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">Upgrade</a>

          {isAuthenticated ? (
            <>
              <span className="text-gray-300">Hello, {user?.name || user?.email}!</span>
              <button
                onClick={handleLogout}
                className="py-2 px-4 border border-white rounded-md hover:bg-white hover:text-black transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="py-2 px-4 border border-white rounded-md hover:bg-white hover:text-black transition-colors"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="hover:text-gray-300 transition-colors"
              >
                Log in
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button (Optional) */}
        <div className="md:hidden">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
