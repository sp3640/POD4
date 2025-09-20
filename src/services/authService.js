import { apiClient } from './api'

export const authService = {
  // Login user
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password })
    
    // Store token
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    
    return response.user
  },

  // Register new user
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    
    // Store token
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    
    return response.user
  },

  // Logout user
  logout() {
    localStorage.removeItem('token')
  },

  // Get current user
  async getCurrentUser() {
    return apiClient.get('/auth/me')
  },

  // Update user profile
  async updateProfile(updates) {
    return apiClient.put('/auth/profile', updates)
  },

  // Get all users (admin only)
  async getUsers() {
    return apiClient.get('/auth/users')
  },

  // Update user (admin only)
  async updateUser(id, updates) {
    return apiClient.put(`/auth/users/${id}`, updates)
  },

  // Delete user (admin only)
  async deleteUser(id) {
    return apiClient.delete(`/auth/users/${id}`)
  }
}