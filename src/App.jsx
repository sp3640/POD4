import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Component Imports
import AuctionDetails from './components/auction/AuctionDetails';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Register from './components/auth/Register';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import NotificationSystem from './components/shared/NotificationSystem';
import Toast from './components/shared/Toast';

// Context/Provider Imports
// Corrected path to the new AuctionProvider
import { AuctionProvider } from './hooks/auction/AuctionProvider';
import NotificationProvider from './hooks/notification/NotificationProvider';

// Removed mock data and websocket imports

// Page Imports
import Auctions from './pages/Auctions';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';

// Style Imports
import './styles/App.css';

// Removed the mock data initialization

function App() {
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Removed all websocket-related logic

  return (
    <Router>
      {/* AuthProvider is in main.jsx, so it's removed from here */}
      <AuctionProvider>
        <NotificationProvider>
          <div className="app-container">
            <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/auction/:id" element={<AuctionDetails />} />

                {/* Auth Routes */}
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
                    <ProtectedRoute requiredRole="Admin"> {/* Case sensitive: Match backend */}
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

            {/* Removed WebSocket status indicator */}

          </div>
        </NotificationProvider>
      </AuctionProvider>
    </Router>
  );
}

export default App;

