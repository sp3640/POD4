// src/services/reviewService.js
import { reviewApi } from './apiClients';

export const reviewService = {
  async submitReview(reviewData) {
    // Calls POST /api/Reviews
    return reviewApi.post('/Reviews', reviewData);
  },
  
  async getReviewsForUser(username) {
    // Calls GET /api/Reviews/{username}
    return reviewApi.get(`/Reviews/${username}`);
  },
  
  async getReviewsForAuction(auctionId) {
    // Calls your new backend endpoint
    return reviewApi.get(`/Reviews/auction/${auctionId}`);
  }
};