
import { useCallback, useEffect, useState } from 'react'
import { authService } from '../../services/authService'
import { AuthContext } from './AuthContext'
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const userData = await authService.login(email, password)
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const newUser = await authService.register(userData)
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    authService.logout()
  }, [])

  const getUsers = useCallback(async () => {
    try {
      setLoading(true)
      const users = await authService.getUsers()
      return users
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getUsers,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isSeller: user?.role === 'SELLER',
    isBuyer: user?.role === 'BUYER'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
