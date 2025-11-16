import { apiClient, setAccessToken, clearAccessToken } from './apiService';

/**
 * Auth Service
 * - Login: Nhận access_token từ response, refresh_token tự động set vào cookie
 * - Logout: Xóa cookie và clear access token
 * - Register: Đăng ký user mới
 */

export const authService = {
  /**
   * Login
   */
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', {
      email: username, // Backend dùng userName
      password: password  // Backend dùng passWord
    });

    // Lưu access token vào memory (Backend trả về accessToken - camelCase)
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }

    // refresh_token đã được backend set vào cookie tự động

    return response.data;
  },

  /**
   * Register
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },
  /**
   * Logout
   * Gọi API để xóa refresh_token cookie
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      // Clear access token khỏi memory
      clearAccessToken();
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn clear token dù có lỗi
      clearAccessToken();
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/account');
    return response.data;
  },

  /**
   * Refresh token (sẽ được gọi tự động bởi interceptor)
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.get('/auth/refresh');

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      clearAccessToken();
      throw error;
    }
  }
};