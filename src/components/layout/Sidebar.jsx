import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/Sidebar.css'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
            onClick={onClose}
          >
            Home
          </Link>

          <Link 
            to="/auctions" 
            className={`sidebar-link ${isActive('/auctions') ? 'active' : ''}`}
            onClick={onClose}
          >
            Auctions
          </Link>

          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={onClose}
              >
                Dashboard
              </Link>

              <Link 
                to="/profile" 
                className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={onClose}
              >
                Profile
              </Link>

              {user.role === 'SELLER' && (
                <Link 
                  to="/create-auction" 
                  className={`sidebar-link ${isActive('/create-auction') ? 'active' : ''}`}
                  onClick={onClose}
                >
                  Create Auction
                </Link>
              )}
            </>
          )}

          <div className="sidebar-divider"></div>

          {user ? (
            <Link to="/logout" className="sidebar-link" onClick={onClose}>
              Logout
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`sidebar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={onClose}
              >
                Login
              </Link>

              <Link 
                to="/register" 
                className={`sidebar-link ${isActive('/register') ? 'active' : ''}`}
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar