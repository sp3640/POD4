import { useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AuctionDetails from './components/auction/AuctionDetails'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Register from './components/auth/Register'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import NotificationSystem from './components/shared/NotificationSystem'
import Toast from './components/shared/Toast'
import { initializeMockData } from './data'
import { AuctionProvider } from './hooks/auction/useAuctions'
import AuthProvider from './hooks/auth/AuthProvider'
import NotificationProvider from './hooks/notification/NotificationProvider'
import { useWebSocket } from './hooks/useWebSocket'
import Auctions from './pages/Auctions'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Profile from './pages/Profile'
import './styles/App.css'
import PublicRoute from './components/auth/PublicRoute'


// Initialize mock data for development
initializeMockData()

function App() {
  const [toast, setToast] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { connect, disconnect, isConnected } = useWebSocket()

  // Removed unused showToast function

  useEffect(() => {
    // Connect to WebSocket server for real-time updates
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    connect(wsUrl)

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <Router>
      <AuthProvider>
        <AuctionProvider>
          <NotificationProvider>
            <div className="app">
              <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
              <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auctions" element={<Auctions />} />
                  <Route path="/auction/:id" element={<AuctionDetails />} />

                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

              </main>

              <Footer />

              {/* Notification Systems */}
              <NotificationSystem />
              {toast && (
                <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
                />
              )}

              {/* WebSocket Connection Status Indicator (for development) */}
              {/* {import.meta.env.DEV && (
                <div className={`websocket-status ${isConnected ? 'connected' : 'disconnected'}`}>
                  WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
                </div>
              )} */}
            </div>
          </NotificationProvider>
        </AuctionProvider>
      </AuthProvider>
    </Router>
  )
}

export default App