/**
 * 🔐 AuthProvider.jsx
 * 
 * Provider component quản lý Authentication state cho toàn bộ app
 * - Auto verify JWT token khi app load (check xem user còn login không)
 * - Cung cấp login/logout/register functions cho toàn app
 * - Persist user state trong memory (JWT token được lưu trong HttpOnly cookie)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/AuthService';
import { getAccessToken } from '../services/apiService';
import { extractUserFromToken } from '../utils/jwtHelper';

export default function AuthProvider({ children }) {
  // ============================================
  // 🔒 AUTH STATE
  // ============================================
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // True lúc đầu để verify token

  // ============================================
  // 🔓 VERIFY TOKEN ON APP LOAD (ENTERPRISE PATTERN)
  // ============================================
  useEffect(() => {
    const verifyUserToken = async () => {
      // ⭐ ĐỊNH NGHĨA PUBLIC ROUTES (không cần authentication)
      const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];
      const currentPath = window.location.pathname;

      // ⭐ Bỏ qua verify nếu đang ở public route
      const isPublicRoute = publicRoutes.some(route =>
        currentPath === route || currentPath.startsWith(route + '/')
      );

      if (isPublicRoute) {
        console.log('⏭️ Skip verification on public route:', currentPath);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Verifying authentication token...');

        // ⭐ BƯỚC 1: Thử refresh token trước (từ HttpOnly cookie)
        // Nếu có refresh_token cookie, backend sẽ generate access_token mới
        try {
          console.log('🔄 Attempting to refresh access token...');
          const refreshResponse = await authService.refreshToken();

          if (refreshResponse && refreshResponse.accessToken) {
            console.log('✅ Access token refreshed successfully');
            // refreshToken() đã set access token vào memory rồi
          }
        } catch (refreshError) {
          console.log('⚠️ No valid refresh token found:', refreshError.message);
          // Không có refresh token hoặc đã expired → user chưa login
          setIsLoading(false);
          return;
        }

        // ⭐ BƯỚC 2: Giờ mới gọi getCurrentUser() với access token mới
        const response = await authService.getCurrentUser();

        if (response) {
          setUser(response);
          setIsAuthenticated(true);
          console.log('✅ User authenticated:', response.email || response.name);
        }
      } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        // Token invalid/expired hoặc chưa login
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserToken();
  }, []);  // ============================================
  // 🔐 LOGIN FUNCTION
  // ============================================
  const login = useCallback(async (username, password) => {
    try {
      console.log('🔐 Logging in user:', username);
      const response = await authService.login(username, password);

      // authService.login đã tự động lưu access_token vào memory
      // Lấy access token và decode để lấy thông tin user
      const accessToken = getAccessToken();
      let userData = null;

      if (accessToken) {
        // Extract user info từ JWT token
        const tokenData = extractUserFromToken(accessToken);
        
        if (tokenData) {
          userData = {
            name: tokenData.name,
            email: tokenData.email,
            userId: tokenData.userId,
          };
        }
      }

      // Fallback: Nếu không decode được, gọi API getCurrentUser
      if (!userData) {
        userData = await authService.getCurrentUser();
      }

      setUser(userData);
      setIsAuthenticated(true);
      console.log('✅ Login successful:', userData.name || userData.email);
      return { user: userData, ...response };
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error; // Re-throw để LoginForm có thể handle
    }
  }, []);

  // ============================================
  // 🔓 LOGOUT FUNCTION
  // ============================================
  const logout = useCallback(async () => {
    try {
      console.log('🔓 Logging out user...');
      await authService.logout();

      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Vẫn clear local state ngay cả khi API fail
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  // ============================================
  // 📝 REGISTER FUNCTION
  // ============================================
  const register = useCallback(async (userData) => {
    try {
      console.log('📝 Registering new user:', userData.email);
      const response = await authService.register(userData);

      // Sau khi register, get thông tin user
      const user = await authService.getCurrentUser();

      setUser(user);
      setIsAuthenticated(true);
      console.log('✅ Registration successful:', user.email || user.userName);
      return { user, ...response };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }, []);

  // ============================================
  // 🔄 UPDATE USER FUNCTION (local only)
  // ============================================
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
    }));
  }, []);

  // ============================================
  // 🎁 CONTEXT VALUE
  // ============================================
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  // Hiển thị loading khi đang verify token
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="mt-4 text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
