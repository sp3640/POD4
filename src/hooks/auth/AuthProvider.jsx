
import { useCallback, useEffect, useState } from 'react'
import { authService } from '../../services/authService'
import { AuthContext } from './AuthContext'
const USERS_DB = [
  {firstName:'buyer',lastName:'buy', email: 'buyer1@gmail.com', password: 'pass123', role: 'BUYER',username:'buyer1' },
  { firstName:'sell',lastName:'er', email: 'seller1@gmail.com', password: 'pass123', role: 'SELLER' ,username:'seller1'},
  { firstName:'ad',lastName:'min', email: 'admin1@gmail.com', password: 'pass123', role: 'ADMIN',username:'admin1' },
]
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [allUsers, setAllUsers] = useState([])

  const login = useCallback(async (email, password,role) => {
    try {
      setLoading(true)
      setError(null)
      const loginUser = USERS_DB.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.role === role
      )
      if (!loginUser) {
        throw new Error('Invalid email, password, or role')
      }
      // const userData = await authService.login(email, password)
      setUser(loginUser)
      localStorage.setItem('user', JSON.stringify(loginUser))
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
      // const newUser = await authService.register(userData)
      const existingUser = USERS_DB.find(
        u => u.email.toLowerCase() === userData.email.toLowerCase()
      )
      if (existingUser) {
        throw new Error('Email already in use')
      }
      const newUser = { id: Date.now(), ...userData }
      USERS_DB.push(newUser)
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
      // const users = await authService.getUsers()
      
       setAllUsers(USERS_DB);
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
useEffect(() => {
  setLoading(true)
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
    }
    console.log(savedUser,"user")
  } catch (err) {
    console.error('Failed to load user from localStorage', err)
    setUser(null)
  } finally {
    setLoading(false)
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
    allUsers,
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
