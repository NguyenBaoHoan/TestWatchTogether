/**
 * 🔐 JWT Helper
 * 
 * Utility functions để decode và extract thông tin từ JWT token
 * - Decode Base64 JWT payload
 * - Extract user info (name, email, roles)
 */

/**
 * Decode JWT token và lấy payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload hoặc null nếu invalid
 */
export const decodeJWT = (token) => {
    if (!token || typeof token !== 'string') {
        return null;
    }

    try {
        // JWT format: header.payload.signature
        const parts = token.split('.');

        if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
        }

        // Decode payload (phần giữa)
        const payload = parts[1];

        // Base64 decode (cần thêm padding nếu thiếu)
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

        // Decode và parse JSON
        const decodedPayload = JSON.parse(atob(paddedBase64));

        return decodedPayload;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

/**
 * Extract thông tin user từ JWT token
 * @param {string} token - JWT token
 * @returns {object} User info { name, email, userId, exp }
 */
export const extractUserFromToken = (token) => {
    const payload = decodeJWT(token);

    if (!payload) {
        return null;
    }

    return {
        name: payload.name || payload.userName || payload.sub || 'User',
        email: payload.email || payload.sub,
        userId: payload.userId || payload.sub,
        roles: payload.roles || [],
        exp: payload.exp, // Expiration time (Unix timestamp)
        iat: payload.iat, // Issued at time
    };
};

/**
 * Kiểm tra JWT token có hết hạn chưa
 * @param {string} token - JWT token
 * @returns {boolean} True nếu token đã hết hạn
 */
export const isTokenExpired = (token) => {
    const payload = decodeJWT(token);

    if (!payload || !payload.exp) {
        return true;
    }

    // exp là Unix timestamp (seconds), Date.now() là milliseconds
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
};

/**
 * Lấy thời gian còn lại của token (seconds)
 * @param {string} token - JWT token
 * @returns {number} Số giây còn lại, hoặc 0 nếu đã hết hạn
 */
export const getTokenTimeRemaining = (token) => {
    const payload = decodeJWT(token);

    if (!payload || !payload.exp) {
        return 0;
    }

    const currentTime = Date.now() / 1000;
    const remaining = payload.exp - currentTime;

    return remaining > 0 ? remaining : 0;
};
