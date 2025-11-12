
import { authApi } from './apiClients';

export const authService = {
  async login(email, password, ) {
    
    const response = await authApi.post('/Account/login', {
      username: email, 
      password,
       
    });
    
    
    if (response.token) {
      
      const user = { 
        username: response.username, 
        email: response.email, 
        role: response.role,
        
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
    
    const registerData = {
      username: userData.email, 
      email: userData.email,
      password: userData.password,
      role: userData.role,
      fullName: `${userData.firstName} ${userData.lastName}` 
    };
    
    
    const response = await authApi.post('/Account/register', registerData);
    
    
    return this.login(userData.email, userData.password, userData.role);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  
  async getUsers() {
    return authApi.get('/Account/users');
  },

  
  async deleteUser(id) {
    return authApi.delete(`/Account/users/${id}`);
  },
  
  async updateProfile(updates) {
    
    console.warn('updateProfile API endpoint not implemented');
    return updates; 
  }
};