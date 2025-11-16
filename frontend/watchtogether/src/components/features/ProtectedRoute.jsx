/**
 * 🔒 ProtectedRoute.jsx
 * 
 * Component để protect routes cần authentication
 * Nếu user chưa login → redirect to /login
 * Nếu đã login → render children
 * 
 * Usage:
 * ```jsx
 * <ProtectedRoute>
 *   <RoomPage />
 * </ProtectedRoute>
 * ```
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Đang loading → hiển thị spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader className="inline-block animate-spin text-yellow-400" size={48} />
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Chưa login → redirect to /login, lưu location để redirect về sau khi login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Đã login → render children
  return children;
}
