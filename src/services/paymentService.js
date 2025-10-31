// src/services/paymentService.js
import { paymentApi } from './apiClients';

export const paymentService = {
  async processPayment(paymentData) {
    // Calls POST /api/Payments/process
    // DTO matches frontend form
    return paymentApi.post('/Payments/process', paymentData);
  },

  // ADD THIS NEW FUNCTION
  async getTransactionForAuction(auctionId) {
    // Calls GET /api/Payments/auction/{auctionId}
    return paymentApi.get(`/Payments/auction/${auctionId}`);
  }
};