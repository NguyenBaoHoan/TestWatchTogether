package com.watchtogether.util;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class CookieUtil {

    // Tên của cookie lưu refresh token
    private final String REFRESH_TOKEN_COOKIE_NAME = "wt_refresh_token";

    /**
     * Tạo một HttpOnly cookie cho Refresh Token
     * @param token Giá trị của refresh token
     * @param maxAge Thời gian sống của cookie (tính bằng giây)
     * @return ResponseCookie
     */
    public ResponseCookie createRefreshTokenCookie(String token, Long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, token)
                .httpOnly(true)     // ⭐ Quan trọng: Ngăn JavaScript truy cập
                .secure(false)      // Đặt là true khi deploy HTTPS
                .path("/")          // Cookie có hiệu lực trên toàn bộ domain
                .maxAge(maxAgeSeconds) // Thời gian sống (ví dụ: 7 ngày)
                .sameSite("Lax")    // Chống CSRF (Lax hoặc Strict)
                .build();
    }

    /**
     * Tạo một cookie rỗng để xóa Refresh Token
     * @return ResponseCookie
     */
    public ResponseCookie clearRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(false) // Phải khớp với lúc tạo
                .path("/")
                .maxAge(0) // Hết hạn ngay lập tức
                .sameSite("Lax")
                .build();
    }

    /**
     * Đọc giá trị refresh token từ request
     * @param request HttpServletRequest
     * @return Giá trị token, hoặc null nếu không tìm thấy
     */
    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}