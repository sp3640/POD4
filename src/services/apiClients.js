// src/services/apiClients.js
import axios from 'axios';

// Base URLs from your Swagger screenshots
const AUTH_SERVICE_URL = 'http://localhost:5222/api';
const AUCTION_SERVICE_URL = 'http://localhost:5115/api';
const BID_SERVICE_URL = 'http://localhost:5133/api';
const PAYMENT_SERVICE_URL = 'http://localhost:5255/api';
const REVIEW_SERVICE_URL = 'http://localhost:5027/api';

/**
 * Creates a pre-configured Axios instance.
 * @param {string} baseURL - The base URL for the microservice.
 */
const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a request interceptor to automatically attach the JWT token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to return data directly
  // and handle errors globally
  instance.interceptors.response.use(
    (response) => response.data, // Return response.data directly
    (error) => {
      console.error('API Error:', error);
      // Return a rejected promise with the error message
      return Promise.reject(error.response?.data || error.message);
    }
  );

  return instance;
};

// Export an instance for each microservice
export const authApi = createApiClient(AUTH_SERVICE_URL);
export const auctionApi = createApiClient(AUCTION_SERVICE_URL);
export const bidApi = createApiClient(BID_SERVICE_URL);
export const paymentApi = createApiClient(PAYMENT_SERVICE_URL);
export const reviewApi = createApiClient(REVIEW_SERVICE_URL);