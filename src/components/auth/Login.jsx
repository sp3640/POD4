import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/Auth.css'

// Mock DB
const USERS_DB = [
  { email: 'buyer1@gmail.com', password: 'pass123', role: 'buyer' },
  { email: 'user1@gmail.com', password: 'pass123', role: 'user' },
  { email: 'admin1@gmail.com', password: 'pass123', role: 'admin' },
]

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Find user by email, password, and role
      const user = USERS_DB.find(
        u =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.password === formData.password &&
          u.role === formData.role
      )

      if (!user) {
        throw new Error('Invalid email, password, or role')
      }

      // Save to localStorage (optional)
      localStorage.setItem('user', JSON.stringify(user))

      // Redirect based on role
      
        navigate('/dashboard')
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
