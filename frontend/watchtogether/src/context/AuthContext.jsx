/**
 * 🔐 AuthContext.jsx
 * 
 * Context chứa state và actions của Authentication
 * - user: Current user object
 * - isAuthenticated: Boolean flag
 * - isLoading: Loading state khi verify token
 * - login, logout, register functions
 */

import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  // Auth state
  user: null,              // User object: { id, email, name, avatar }
  isAuthenticated: false,  // True nếu user đã login
  isLoading: true,         // True khi đang verify token lúc init app

  // Auth actions
  login: async (email, password, rememberMe) => {
    void email;
    void password;
    void rememberMe;
  },
  logout: async () => { },
  register: async (userData) => { void userData; },
  updateUser: (userData) => { void userData; }, // Update user info locally
});

/**
 * Custom hook để sử dụng AuthContext
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
