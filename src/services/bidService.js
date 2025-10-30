// src/services/bidService.js
import { bidApi } from './apiClients';

export const bidService = {
  async getBidsForAuction(auctionId) {
    // Calls GET /api/Bids/{auctionId}
    return bidApi.get(`/Bids/${auctionId}`);
  },
  
  async placeBid(auctionId, amount) {
    // Calls POST /api/Bids
    // DTO is { auctionId, amount }
    return bidApi.post('/Bids', { auctionId, amount });
  }
};