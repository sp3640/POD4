
import { paymentApi } from './apiClients';

export const paymentService = {
  async processPayment(paymentData) {
    
    
    return paymentApi.post('/Payments/process', paymentData);
  },

  
  async getTransactionForAuction(auctionId) {
    
    return paymentApi.get(`/Payments/auction/${auctionId}`);
  }
};