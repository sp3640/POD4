// src/services/auctionService.js
import { auctionApi } from './apiClients';

export const auctionService = {
  async getAuctions(filters = {}) {
    // Your backend doesn't support filters, so we ignore them
    return auctionApi.get('/Auctions');
  },

  async getAuction(id) {
    return auctionApi.get(`/Auctions/${id}`);
  },

  async createAuction(auctionData) {
    // Convert frontend data to backend DTO
    const dto = {
      productName: auctionData.productName,
      description: auctionData.description,
      startPrice: parseFloat(auctionData.startingPrice),
      // Convert hours (from form) to minutes (for backend)
      durationMinutes: parseInt(auctionData.duration, 10) * 60, 
      imageUrl: auctionData.imageUrl || null // Send the first image URL
    };
    return auctionApi.post('/Auctions', dto);
  },

 async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file); 
    
    // This tells axios to remove the default 'application/json' 
    // and let the browser set the correct 'multipart/form-data'
    // header with the required boundary.
    return auctionApi.post('/Upload/upload', formData, {
      headers: {
        'Content-Type': undefined
      }
    });
  },
  
  // NOTE: Watchlist is not implemented in your backend.
  async watchAuction(auctionId) {
    console.warn('watchAuction API endpoint not specified');
    return { success: true }; // Placeholder
  },

  async unwatchAuction(auctionId) {
    console.warn('unwatchAuction API endpoint not specified');
    return { success: true }; // Placeholder
  }
};