# 🎬 WatchTogether

A modern web application that allows you to watch videos together with friends in real-time. Create rooms, share links, and enjoy synchronized viewing experiences with integrated chat functionality.

![WatchTogether Preview](https://via.placeholder.com/800x400/1e2025/ffffff?text=WatchTogether+App+Preview)

## ✨ Features

- **🎥 Synchronized Viewing** - Watch videos together in perfect sync
- **💬 Integrated Chat** - Talk to friends while watching
- **🌐 Multiple Platforms** - Support for YouTube, Vimeo, Dailymotion, SoundCloud, and more
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🚀 No Account Required** - Create rooms instantly without registration
- **📋 Playlist Support** - Organize content into playlists
- **📹 Webcam Support** - Video chat with friends
- **🎨 Modern UI** - Beautiful interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)
- **Code Quality**: ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/watchtogether.git
   cd watchtogether
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Backend Setup

This frontend application requires a backend API running on `http://localhost:8080`. Make sure to:

1. Set up your backend server with the room creation endpoint
2. Ensure CORS is properly configured
3. The API should have a `POST /api/rooms` endpoint

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
src/
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── Hero.jsx       # Landing page hero section
│   │   └── About.jsx      # About section with features
│   └── layout/            # Layout components
│       ├── Header.jsx     # Navigation header
│       └── Footer.jsx     # Site footer
├── pages/
│   └── HomePage.jsx       # Main home page
├── services/
│   └── Room.jsx          # API service for room management
├── App.jsx               # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## 🎨 Design Features

- **Background**: Stunning cityscape background with overlay
- **Responsive Layout**: Mobile-first design approach
- **Interactive Elements**: Hover effects and smooth transitions
- **Modern Typography**: Clean, readable font hierarchy
- **Color Scheme**: Dark theme with yellow accent colors

## 🌟 How It Works

1. **Create a Room** - Click the "Create Room" button to generate a new viewing room
2. **Share the Link** - Send the room link to your friends
3. **Watch Together** - Enjoy synchronized video playback with your friends

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Tailwind CSS

The project uses Tailwind CSS v4 with Vite plugin. Configuration is handled automatically, but you can customize it by creating a `tailwind.config.js` file if needed.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Todo

- [ ] Implement useRoom hook for room management
- [ ] Add user authentication system
- [ ] Implement real-time chat functionality
- [ ] Add video player integration
- [ ] Set up WebSocket connections for real-time sync
- [ ] Add mobile navigation menu
- [ ] Implement playlist management
- [ ] Add webcam support

## 🐛 Known Issues

- The `useRoom` hook is referenced but not yet implemented
- Backend API endpoints need to be set up
- Mobile navigation menu needs implementation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Vite](https://vitejs.dev/)

## 📞 Contact

Your Name - [@yourusername](https://twitter.com/yourusername) - email@example.com

Project Link: [https://github.com/yourusername/watchtogether](https://github.com/yourusername/watchtogether)

---

⭐️ If you found this project helpful, please give it a star!