
import { bidApi } from './apiClients';
import { auctionService } from './auctionService';

export const bidService = {
  async getBidsForAuction(auctionId) {
    
    return bidApi.get(`/Bids/${auctionId}`);
  },
  
  async placeBid(auctionId, amount) {
    try {
      
      const response = await bidApi.post('/Bids', { auctionId, amount });

      
      const bid = response.data;

      

      return bid;
    } catch (error) {
      console.error('Bid placement or highest bid update failed:', error.response?.data || error.message);
      throw error;
    }
  }
};