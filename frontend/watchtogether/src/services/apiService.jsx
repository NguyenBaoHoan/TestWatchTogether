import axios from 'axios';

/**
 * Axios instance
 * - withCredentials: true → Tự động gửi cookies (refresh_token)
 * - Không cần Authorization header vì sẽ được thêm động
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ⚠️ Quan trọng: Cho phép gửi/nhận cookies
});

// Biến toàn cục để lưu access token (trong memory, không phải localStorage)
let accessToken = null;

/**
 * Set access token vào memory
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Get access token từ memory
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * Clear access token
 */
export const clearAccessToken = () => {
  accessToken = null;
};

/**
 * Request Interceptor "người gác cổng" ở cửa đi.
 * Tự động thêm access token vào header
 */
apiClient.interceptors.request.use(
  (config) => {
    // Nếu có access token, thêm vào Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Xử lý auto refresh token khi 401
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ⭐ GUARD: Không retry nếu là auth endpoints để tránh loop
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    
    // Nếu 401 và chưa retry và KHÔNG phải auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // Nếu đang refresh, đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh token API (refresh_token tự động gửi qua cookie)
        // Sử dụng axios trực tiếp để tránh circular interceptor call
        const response = await axios.get('http://localhost:8080/api/v1/auth/refresh', {
          withCredentials: true,
          timeout: 10000
        });

        const newAccessToken = response.data.accessToken;

        // Lưu access token mới
        setAccessToken(newAccessToken);

        // Xử lý các request đang chờ
        processQueue(null, newAccessToken);

        // Retry original request với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();

        // ⭐ CHỈ redirect nếu KHÔNG đang ở trang login/register
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('❌ Response Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export { apiClient };