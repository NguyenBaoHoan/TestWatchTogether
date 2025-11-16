# 🎯 LUỒNG DASHBOARD SAU KHI ĐĂNG NHẬP

## 📋 TÓM TẮT TỔNG QUAN

Sau khi user đăng nhập thành công, hệ thống sẽ:
1. **Decode JWT token** để lấy tên user
2. **Chuyển hướng** đến trang Dashboard (`/dashboard`)
3. **Hiển thị giao diện** giống w2g.tv với tên user và lịch sử phòng
4. **Bảo vệ route** bằng ProtectedRoute (yêu cầu login)

---

## 🗂️ CÁC FILE ĐÃ TẠO/CẬP NHẬT

### **1. `utils/jwtHelper.js` (MỚI)** ✨
**Mục đích**: Decode JWT token để lấy thông tin user

**Các function chính**:
- `decodeJWT(token)` - Decode Base64 payload từ JWT
- `extractUserFromToken(token)` - Lấy name, email, userId từ token
- `isTokenExpired(token)` - Kiểm tra token còn hạn không
- `getTokenTimeRemaining(token)` - Tính thời gian còn lại

**Luồng hoạt động**:
```
JWT Token: "eyJhbGc...payload...signature"
         ↓
Split thành 3 phần: [header, payload, signature]
         ↓
Base64 decode phần payload
         ↓
Parse JSON → { name, email, userId, exp, ... }
```

---

### **2. `pages/DashboardPage.jsx` (MỚI)** ✨
**Mục đích**: Trang Dashboard hiển thị sau khi login

**Cấu trúc giao diện**:
```
┌─────────────────────────────────────────────┐
│ Header                                       │
│ - Logo "Watch2Gether"                       │
│ - Nút "Nâng Cấp"                            │
│ - Avatar + Tên user (từ JWT) + Dropdown     │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ Main Content                                 │
│                                              │
│ "Phòng Của Tôi"        [Refresh] [Tạo Phòng]│
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ 🕐 Phòng Tạm Thời                       │ │
│ │ 👥 1 người • 10/11/2025 • Đang hoạt động│ │
│ │                         [Vào Phòng →]   │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Chức năng**:
- ✅ Hiển thị tên user từ `useAuth()` context
- ✅ Nút "Tạo Phòng Mới" → Gọi API → Navigate to `/room/{roomId}`
- ✅ Danh sách lịch sử phòng với thông tin chi tiết
- ✅ Nút "Vào Phòng" để join lại phòng cũ
- ✅ Empty state khi chưa có phòng
- ✅ Dropdown menu: Đăng xuất
- ✅ Responsive design (Mobile-friendly)

---

### **3. `context/AuthProvider.jsx` (CẬP NHẬT)** 🔄
**Thay đổi**: Thêm logic decode JWT token trong hàm `login()`

**Luồng mới**:
```
User nhập email/password → Click "Sign In"
         ↓
authService.login(username, password)
         ↓
Backend trả về: { accessToken, refreshToken }
         ↓
setAccessToken(token) → Lưu vào memory
         ↓
getAccessToken() → Lấy token từ memory
         ↓
extractUserFromToken(token) → Decode JWT
         ↓
{ name, email, userId } → Lưu vào state
         ↓
setUser(userData)
setIsAuthenticated(true)
         ↓
LoginPage navigate to "/dashboard"
```

**Fallback**:
- Nếu decode JWT thất bại → Gọi API `/auth/account`
- Đảm bảo luôn có user data dù JWT format sai

---

### **4. `pages/LoginPage.jsx` (CẬP NHẬT)** 🔄
**Thay đổi**: Redirect đến `/dashboard` thay vì `/`

**Trước**:
```javascript
const handleLoginSuccess = () => {
  navigate('/', { replace: true }); // ❌ Về trang chủ
};
```

**Sau**:
```javascript
const handleLoginSuccess = () => {
  navigate('/dashboard', { replace: true }); // ✅ Vào Dashboard
};
```

---

### **5. `main.jsx` (CẬP NHẬT)** 🔄
**Thay đổi**: Thêm route `/dashboard` với ProtectedRoute

**Route mới**:
```javascript
{
  path: '/dashboard', 
  element: (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ) 
}
```

**Cơ chế bảo vệ**:
- Nếu `isAuthenticated = false` → Redirect to `/login`
- Nếu `isAuthenticated = true` → Render `<DashboardPage />`
- Lưu `location.state.from` để redirect về sau khi login

---

## 🔄 LUỒNG HOẠT ĐỘNG TOÀN BỘ HỆ THỐNG

### **Kịch bản 1: User chưa login, truy cập `/dashboard`**
```
1. User navigate to /dashboard
2. ProtectedRoute kiểm tra isAuthenticated → FALSE
3. Redirect to /login với state.from = "/dashboard"
4. User nhập email/password → Click "Sign In"
5. AuthProvider.login() decode JWT → lưu user data
6. LoginPage.handleLoginSuccess() → navigate('/dashboard')
7. ProtectedRoute kiểm tra isAuthenticated → TRUE
8. Render DashboardPage với tên user từ JWT
```

### **Kịch bản 2: User đã login, refresh trang `/dashboard`**
```
1. App load → AuthProvider.useEffect() chạy
2. Kiểm tra publicRoutes → /dashboard KHÔNG phải public
3. Gọi authService.refreshToken() (dùng refresh_token cookie)
4. Backend trả về access_token mới
5. Gọi authService.getCurrentUser() → Lấy user data
6. setUser(userData) + setIsAuthenticated(true)
7. setIsLoading(false)
8. ProtectedRoute render DashboardPage
```

### **Kịch bản 3: User click "Tạo Phòng Mới"**
```
1. User click button "Tạo Phòng Mới"
2. handleCreateRoom() → createRoom() (RoomContext)
3. POST /api/rooms → Backend tạo room mới
4. Response: { roomId, roomName, accessToken }
5. navigate(`/room/${roomId}`) → Vào trang phòng
6. RoomPage render với video player
```

### **Kịch bản 4: User click "Đăng Xuất"**
```
1. User click "Đăng Xuất" trong dropdown
2. handleLogout() → authService.logout()
3. POST /auth/logout → Backend xóa refresh_token cookie
4. clearAccessToken() → Xóa access_token khỏi memory
5. setUser(null) + setIsAuthenticated(false)
6. navigate('/login') → Quay về trang login
```

---

## 🎨 GIAO DIỆN DASHBOARD

### **Màu sắc**:
- Background: Gradient xanh đen (`bg-gradient-to-br from-gray-900 via-gray-800`)
- Primary: Xanh dương (`blue-600`, `blue-700`)
- Accent: Vàng (`yellow-400`)
- Text: Trắng + Xám (`white`, `gray-400`)

### **Typography**:
- Tiêu đề: `text-3xl font-bold` (Phòng Của Tôi)
- Tên user: `font-semibold text-white`
- Thông tin phụ: `text-sm text-gray-400`

### **Components**:
- **Header**: Sticky top, backdrop-blur, border-bottom
- **Room Card**: Glass morphism, hover effect, border-blue on hover
- **Buttons**: 
  - Primary: `bg-blue-600 hover:bg-blue-700`
  - Avatar: Gradient yellow-orange circle
- **Icons**: Lucide React hoặc Heroicons (SVG inline)

### **Responsive**:
- Mobile: Single column, stacked buttons
- Tablet: Flex layout with wrap
- Desktop: Full width với max-w-7xl container

---

## 📊 DỮ LIỆU FLOW

### **User Object trong Context**:
```javascript
{
  name: "Nguyễn Văn A",      // Từ JWT token
  email: "hoan@gmail.com",   // Từ JWT token
  userId: "user-123",        // Từ JWT token
}
```

### **JWT Token Payload**:
```json
{
  "sub": "hoan@gmail.com",
  "name": "Nguyễn Văn A",
  "email": "hoan@gmail.com",
  "userId": "user-123",
  "roles": ["USER"],
  "iat": 1699564800,
  "exp": 1699568400
}
```

### **Room History (Mock Data)**:
```javascript
[
  {
    id: 'room-1',
    name: 'Phòng Tạm Thời',
    createdAt: '2025-11-10T10:30:00Z',
    participants: 1,
    isActive: true
  }
]
```

---

## ✅ KIỂM TRA HOÀN THÀNH

### **Frontend**:
- ✅ JWT decode helper functions
- ✅ DashboardPage với giao diện đẹp
- ✅ AuthProvider decode token và lưu user
- ✅ LoginPage redirect to /dashboard
- ✅ Route /dashboard với ProtectedRoute
- ✅ Responsive design
- ✅ Tiếng Việt

### **Backend** (Đã có sẵn):
- ✅ POST /auth/login → Trả accessToken + refreshToken
- ✅ GET /auth/refresh → Refresh access token
- ✅ GET /auth/account → Lấy thông tin user
- ✅ POST /auth/logout → Xóa refresh cookie
- ✅ POST /api/rooms → Tạo phòng mới

### **Security**:
- ✅ Access token trong memory (không localStorage)
- ✅ Refresh token trong HttpOnly cookie
- ✅ Protected routes với authentication check
- ✅ Auto-refresh khi 401 (Axios interceptor)
- ✅ Redirect to login khi unauthorized

---

## 🚀 HƯỚNG DẪN TEST

### **1. Test Login Flow**:
```
1. Mở http://localhost:5173/dashboard (chưa login)
   → Tự động redirect to /login

2. Nhập:
   Email: hoan@gmail.com
   Password: 123456

3. Click "Sign In"
   → Redirect to /dashboard
   → Hiển thị tên user ở góc phải

4. Kiểm tra Console:
   → ✅ Login successful: Nguyễn Văn A
   → ✅ Access token refreshed successfully
```

### **2. Test Create Room**:
```
1. Ở Dashboard, click "Tạo Phòng Mới"
2. Loading spinner hiển thị
3. Backend tạo phòng → Trả roomId
4. Auto navigate to /room/{roomId}
5. Video player hiển thị
```

### **3. Test Logout**:
```
1. Click vào Avatar (góc phải)
2. Dropdown menu hiển thị
3. Click "Đăng Xuất"
4. Redirect to /login
5. Thử vào /dashboard → Redirect về /login
```

### **4. Test Refresh Page**:
```
1. Đăng nhập thành công → Ở Dashboard
2. F5 (Refresh page)
3. Loading spinner hiển thị
4. Auto verify token từ cookie
5. Dashboard render lại với user data
```

---

## 📝 GHI CHÚ

### **Tính năng sẽ cần thêm sau**:
- [ ] Fetch lịch sử phòng từ API (thay mock data)
- [ ] Xóa phòng khỏi lịch sử
- [ ] Share phòng qua link
- [ ] Thông báo realtime khi có người join
- [ ] Avatar upload
- [ ] Dark/Light mode toggle

### **Optimization**:
- [ ] React.memo cho DashboardPage
- [ ] useMemo cho roomHistory filter
- [ ] Lazy loading cho DashboardPage
- [ ] Skeleton loading thay spinner

---

## 🎉 KẾT QUẢ ĐẠT ĐƯỢC

✅ **Giao diện hiện đại** giống w2g.tv
✅ **Tên user từ JWT token** (không cần gọi API thêm)
✅ **Redirect đúng luồng** (login → dashboard)
✅ **Protected route** hoạt động
✅ **Responsive** trên mọi thiết bị
✅ **Tiếng Việt** toàn bộ UI
✅ **"Temporary Room" → "Lịch Sử Phòng Đã Tạo"**
✅ **Không có lỗi compile**

---

**Tạo bởi**: GitHub Copilot  
**Ngày**: 10/11/2025  
**Version**: 1.0.0
