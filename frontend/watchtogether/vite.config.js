import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ⭐ Cấu hình proxy để tránh CORS và cookie cross-origin
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:8080',
        ws: true, // Bật WebSocket proxy
        changeOrigin: true,
        secure: false,
      },
    },
  },

  define: {
    global: 'window',  // Map 'global' thành 'window'
  },

  resolve: {
    alias: {
      // Polyfill cho các module Node.js nếu cần
      buffer: 'buffer/',
      process: 'process/browser',
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      // Thêm global cho esbuild
      define: {
        global: 'window',
      },
    },
  },
})
