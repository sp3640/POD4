// src/components/layout/Header.jsx
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/Header.css'

const Header = ({ onMenuToggle }) => {
  const { user, logout ,isAuthenticated} = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={onMenuToggle}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <Link to="/" className="logo">
            <h1>BidHub</h1>
          </Link>
        </div>

        <nav className="nav">
          <Link to="/auctions" className="nav-link">
            Auctions
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
            {!isAuthenticated &&
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Sign Up
              </Link>
              </>
            }
            </>
          )}
        </nav>

        <div className="header-right">
          {user && (
            <div className="user-info">
              <span className="user-name">Hello, {user.firstName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header