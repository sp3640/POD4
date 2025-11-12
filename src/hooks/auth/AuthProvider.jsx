
import { useCallback, useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    setLoading(true);
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to load user from localStorage', err);
      authService.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => { 
  setLoading(true);
  setError(null);
  try {
      const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser); 
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await authService.getUsers();
      setAllUsers(users);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteUser = useCallback(async (id) => {
     try {
       await authService.deleteUser(id);
       setAllUsers(prev => prev.filter(u => u.id !== id));
     } catch (err) {
       setError(err.message);
       throw err;
     }
  },[]);

  const updateProfile = useCallback(async (updates) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);


  const value = {
    user,
    allUsers,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    getUsers,
    deleteUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;