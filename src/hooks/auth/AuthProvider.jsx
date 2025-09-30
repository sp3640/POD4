
import { useCallback, useEffect, useState } from 'react'
import { authService } from '../../services/authService'
import { AuthContext } from './AuthContext'
const USERS_DB = [
  {user_id:1,firstName:'Kushi',lastName:'Singh', email: 'kushi1@gmail.com', password: 'pass123', role: 'BUYER',username:'kushi1',createdAt:'2023-10-01' },
  {user_id:2,firstName:'Shreya',lastName:'Nigam', email: 'shreya1@gmail.com', password: 'pass123', role: 'BUYER',username:'shreya1',createdAt:'2024-10-01' },
  {user_id:3,firstName:'divyanshu',lastName:'bansal', email: 'bansal1@gmail.com', password: 'pass123', role: 'SELLER',username:'bansal1',createdAt:'2025-10-01' },
  {user_id:4, firstName:'Krati',lastName:'Vaishnavi', email: 'krati@gmail.com', password: 'pass123', role: 'SELLER' ,username:'krati1',createdAt:'2024-10-01'},
  {user_id:5, firstName:'Sidharth',lastName:'Rai', email: 'admin1@gmail.com', password: 'pass123', role: 'ADMIN',username:'admin1',createdAt:'2025-10-01' },
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
  const deleteUser = useCallback(async (id) => {
  try {
    setLoading(true)
    setError(null)

    const index = USERS_DB.findIndex(u => u.user_id === id)
    if (index === -1) throw new Error("User not found")

    USERS_DB.splice(index, 1) // remove from DB
    setAllUsers([...USERS_DB]) // update state

    // If the logged-in user deletes themselves, logout
    if (user?.id === id) {
      setUser(null)
      // localStorage.removeItem("user")
    }
    // localStorage.setItem('user', JSON.stringify([...USERS_DB]))
  } catch (err) {
    setError(err.message)
    throw err
  } finally {
    setLoading(false)
  }
}, [user])


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
    deleteUser,
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
