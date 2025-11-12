
import { reviewApi } from './apiClients';

export const reviewService = {
  async submitReview(reviewData) {
    
    return reviewApi.post('/Reviews', reviewData);
  },
  
  async getReviewsForUser(username) {
    
    return reviewApi.get(`/Reviews/${username}`);
  },
  
  async getReviewsForAuction(auctionId) {
    
    return reviewApi.get(`/Reviews/auction/${auctionId}`);
  }
};