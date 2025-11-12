// src/components/routing/PublicRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
