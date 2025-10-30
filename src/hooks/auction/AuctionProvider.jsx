// src/hooks/auction/AuctionProvider.jsx
// *** RENAME this file to AuctionProvider.jsx ***

import { useCallback, useState, useEffect } from 'react';
import { AuctionContext } from './AuctionContext';
import { auctionService } from '../../services/auctionService';
import { bidService } from '../../services/bidService';
import { reviewService } from '../../services/reviewService';
import { paymentService } from '../../services/paymentService';

export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([]);
  const [watchedAuctions, setWatchedAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all auctions on mount
  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await auctionService.getAuctions(filters);
      setAuctions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAuctionById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch auction, bids, and reviews in parallel
      const [auctionData, bids, reviews] = await Promise.all([
        auctionService.getAuction(id),
        bidService.getBidsForAuction(id),
        reviewService.getReviewsForAuction(id)
      ]);
      
      const fullAuction = { ...auctionData, bids, reviews };

      // Update the single auction in our list
      setAuctions(prev => {
        const index = prev.findIndex(a => a.id === id);
        if (index !== -1) {
          const newList = [...prev];
          newList[index] = fullAuction;
          return newList;
        }
        // If not in list, just add it (though it should be)
        return [...prev, fullAuction]; 
      });
      
      return fullAuction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAuction = useCallback(async (auctionData) => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Upload images
      // const uploadPromises = auctionData.imageUrls.map(file => auctionService.uploadImage(file));
      // const uploadResponses = await Promise.all(uploadPromises);
      // const imageUrls = uploadResponses.map(res => res.url);

      // Step 2: Create auction with image URLs
      const newAuction = await auctionService.createAuction(auctionData);
      
      setAuctions(prev => [newAuction, ...prev]);
      return newAuction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const placeBid = useCallback(async (auctionId, amount) => {
    try {
      setLoading(true);
      setError(null);
      // 'placeBid' in BiddingService calls the AuctionService for us
      const newBid = await bidService.placeBid(auctionId, amount);
      
      // We must re-fetch the auction to get the updated highestBid
      const updatedAuction = await auctionService.getAuction(auctionId);

      setAuctions(prev => 
        prev.map(a => (a.id === auctionId ? updatedAuction : a))
      );
      return updatedAuction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWatchAuction = useCallback(async (auctionId) => {
    console.warn('toggleWatchAuction not implemented');
    setWatchedAuctions(prev => {
      if (prev.includes(auctionId)) {
        return prev.filter(id => id !== auctionId);
      }
      return [...prev, auctionId];
    });
  }, []);
  
  const processPayment = useCallback(async (paymentData) => {
     try {
      setLoading(true);
      setError(null);
      return await paymentService.processPayment(paymentData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (reviewData) => {
     try {
      setLoading(true);
      setError(null);
      return await reviewService.submitReview(reviewData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReviewsByUser = useCallback(async (username) => {
     try {
      setLoading(true);
      setError(null);
      return await reviewService.getReviewsForUser(username);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    auctions,
    watchedAuctions,
    loading,
    error,
    loadAuctions,
    getAuctionById,
    createAuction,
    placeBid,
    toggleWatchAuction,
    processPayment,
    submitReview,
    getReviewsByUser,
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
};