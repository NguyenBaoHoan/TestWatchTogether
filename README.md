# 🎬 WatchTogether (WIP)

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-red?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/SpringBoot-3-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/PostgreSQL-DB-blue?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss" />
</p>

<p align="center">
  <b>Watch movies together in real-time — create a room, invite friends, sync playback, and chat live.</b>
</p>

---

## 🚀 Tech Stack

### 🖥 Backend
- **Java 21** + **Spring Boot 3**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** + **PostgreSQL**
- **Redis** (temporary room storage, TTL)
- **WebSocket** (coming soon, for video sync & chat)
- **JWT (jjwt)**

### 🎨 Frontend
- **React 19** + **Vite 7**
- **Tailwind CSS 4** (Vite plugin)

---

## ✨ Features

### ✅ Current
- 🏠 **Create a shared room** (`POST /rooms`) → returns:
  - `roomId`, `inviteCode`, `accessToken`, `joinUrl`, `wsUrl`
- 🗃️ **Store temporary rooms** in **Redis** (TTL 24h)
- 👤 **Save Host (participant)** into **PostgreSQL**
- 🔑 **JWT** for authenticating actions
- 🔍 **Test endpoints**:
  - `GET /hello` → test API
  - `GET /db-check` → test DB connection

### 🔮 Upcoming
- 🔗 Join room using `inviteCode`
- 🎥 Sync playback state (play/pause/seek) via **WebSocket**
- 👥 Manage **participants** (host/guest roles)
- 💬 In-room chat
- 🎨 Full UI/UX for shared watching experience

---

## 📂 Project Structure

```bash
WatchTogether/
├── backend/        # Spring Boot (API, DB, Redis, JWT, WebSocket)
│   ├── src/main/java/com/watchtogether/
│   └── src/main/resources/
└── frontend/       # React + Vite + Tailwind (UI)
    ├── src/
    └── public/
