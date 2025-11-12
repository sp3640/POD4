
import { auctionApi } from './apiClients';

export const auctionService = {
  async getAuctions(filters = {}) {
    
    return auctionApi.get('/Auctions');
  },
async updateHighestBid(auctionId, amount, bidderUsername) {
    try {
      const response = await auctionApi.put(`/Auctions/highestBid/${auctionId}`, null, {
        params: {
          amount,
          bidderUsername
        }
      });
      return response.status === 204; 
    } catch (error) {
      console.error('Failed to update highest bid:', error.response?.data || error.message);
      return false;
    }
  },

  async getAuction(id) {
    return auctionApi.get(`/Auctions/${id}`);
  },

  async createAuction(auctionData) {
    
    const dto = {
      productName: auctionData.productName,
      description: auctionData.description,
      startPrice: parseFloat(auctionData.startingPrice),
      
      durationMinutes: parseInt(auctionData.duration, 10) * 60, 
      imageUrl: auctionData.imageUrl || null 
    };
    return auctionApi.post('/Auctions', dto);
  },

 async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file); 
    
    
    return auctionApi.post('/Upload/upload', formData, {
      headers: {
        'Content-Type': undefined
      }
    });
  },
  
  
  async watchAuction(auctionId) {
    console.warn('watchAuction API endpoint not specified');
    return { success: true }; 
  },

  async unwatchAuction(auctionId) {
    console.warn('unwatchAuction API endpoint not specified');
    return { success: true }; 
  }
};