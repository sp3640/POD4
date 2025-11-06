// src/services/bidService.js
import { bidApi } from './apiClients';
import { auctionService } from './auctionService';

export const bidService = {
  async getBidsForAuction(auctionId) {
    // Calls GET /api/Bids/{auctionId}
    return bidApi.get(`/Bids/${auctionId}`);
  },
  
  async placeBid(auctionId, amount) {
    try {
      // Place the bid
      const response = await bidApi.post('/Bids', { auctionId, amount });

      // Extract bid info from response
      const bid = response.data;

      // Call updateHighestBid using the bid info
     // await auctionService.updateHighestBid(auctionId, bid.amount, bid.bidderUsername);

      return bid;
    } catch (error) {
      console.error('Bid placement or highest bid update failed:', error.response?.data || error.message);
      throw error;
    }
  }
};