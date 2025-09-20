// src/services/auctionService.js
import { apiClient } from './api'

export const auctionService = {
  async getAuctions(filters = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value)
      }
    })
    return apiClient.get(`/auctions?${queryParams.toString()}`)
  },

  async getAuction(id) {
    return apiClient.get(`/auctions/${id}`)
  },

  async createAuction(auctionData) {
    return apiClient.post('/auctions', auctionData)
  },

  async placeBid(auctionId, amount) {
    return apiClient.post(`/auctions/${auctionId}/bids`, { amount })
  },

  async watchAuction(auctionId) {
    return apiClient.post(`/auctions/${auctionId}/watch`)
  },

  async unwatchAuction(auctionId) {
    return apiClient.delete(`/auctions/${auctionId}/watch`)
  },

  async processPayment(paymentData) {
    return apiClient.post('/payments', paymentData)
  },

  async submitReview(reviewData) {
    return apiClient.post('/reviews', reviewData)
  }
}