

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
  
  const getTransactionForAuction = useCallback(async (auctionId) => {
    try {
      setLoading(true); 
      setError(null);
      return await paymentService.getTransactionForAuction(auctionId);
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  const getAuctionById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      
      const [auctionData, bids, reviews] = await Promise.all([
        auctionService.getAuction(id),
        bidService.getBidsForAuction(id),
        reviewService.getReviewsForAuction(id)
      ]);
      
      const fullAuction = { ...auctionData, bids, reviews };

      
      setAuctions(prev => {
        const index = prev.findIndex(a => a.id === id);
        if (index !== -1) {
          const newList = [...prev];
          newList[index] = fullAuction;
          return newList;
        }
        
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
      
      const newBid = await bidService.placeBid(auctionId, amount);
      
      
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
    getTransactionForAuction,
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
};