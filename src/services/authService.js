// src/services/authService.js
import { authApi } from './apiClients';

export const authService = {
  async login(email, password, ) {
    // Your backend 'AccountController' uses "Username" for login.
    // We will map the 'email' field to 'username' here.
    const response = await authApi.post('/Account/login', {
      username: email, // Mapping email to username
      password,
       // Role is not used by your login DTO, but we pass it anyway
    });
    
    // Your backend returns: { token, username, email, role }
    if (response.token) {
      // Create user object for local storage
      const user = { 
        username: response.username, 
        email: response.email, 
        role: response.role,
        // Your backend doesn't return ID or name, so we use username
        id: response.username, 
        firstName: response.username 
      };
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('Login failed');
  },

  async register(userData) {
    // Your 'Register.jsx' sends { firstName, lastName, email, ... }
    const registerData = {
      username: userData.email, // Use email as username
      email: userData.email,
      password: userData.password,
      role: userData.role,
      fullName: `${userData.firstName} ${userData.lastName}` // Use the new DTO field
    };
    
    // This just returns { message: "..." }
    const response = await authApi.post('/Account/register', registerData);
    
    // After registering, we log them in to get a token
    return this.login(userData.email, userData.password, userData.role);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // For Admin Dashboard
  async getUsers() {
    return authApi.get('/Account/users');
  },

  // For Admin Dashboard
  async deleteUser(id) {
    return authApi.delete(`/Account/users/${id}`);
  },
  
  async updateProfile(updates) {
    // Your backend does not have an update profile endpoint.
    console.warn('updateProfile API endpoint not implemented');
    return updates; // Placeholder
  }
};