import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import RoomProvider from './context/RoomProvider.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import HomePage from './pages/HomePage.jsx'
import RoomRoute from './pages/RoomRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProtectedRoute from './components/features/ProtectedRoute.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TestWebSocket } from './pages/TestWebSocket.jsx'
import TestPage from './__tests__/TestPage.jsx'
import TestPageGemini from './__tests__/TestPageGemini.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { 
        path: '/dashboard', 
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ) 
      },
      { path: "/ws-test", element: <TestWebSocket /> },
      { path: "/test", element: <TestPage /> },
      { path: "/testgemini", element: <TestPageGemini /> }
    ],
  },
  { path: 'room/:roomId', element: <RoomRoute /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RoomProvider>
        <RouterProvider router={router} />
      </RoomProvider>
    </AuthProvider>
  </StrictMode>
)
