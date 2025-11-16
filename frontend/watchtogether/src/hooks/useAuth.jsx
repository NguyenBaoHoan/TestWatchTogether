/**
 * 🪝 useAuth.jsx
 * 
 * Custom hook để sử dụng Authentication context
 * Import hook này thay vì import useContext và AuthContext mỗi lần
 * 
 * Usage:
 * ```jsx
 * import { useAuth } from '../hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   // ...
 * }
 * ```
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default useAuth;
