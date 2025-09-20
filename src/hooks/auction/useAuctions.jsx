import { useCallback, useState } from 'react'
import { auctionService } from '../../services/auctionService'
import { useWebSocket } from '../useWebSocket'
import { AuctionContext } from './AuctionContext'


// const AuctionContext = createContext()

export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([])
  const [watchedAuctions, setWatchedAuctions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { subscribeToBids, unsubscribeFromBids, sendBid } = useWebSocket()

  const loadAuctions = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await auctionService.getAuctions(filters)
      setAuctions(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getAuctionById = useCallback(async (id) => {
    try {
      setLoading(true)
      const auction = await auctionService.getAuction(id)
      return auction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createAuction = useCallback(async (auctionData) => {
    try {
      setLoading(true)
      setError(null)
      const newAuction = await auctionService.createAuction(auctionData)
      setAuctions(prev => [newAuction, ...prev])
      return newAuction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const placeBid = useCallback(async (auctionId, amount) => {
    try {
      setError(null)
      const updatedAuction = await auctionService.placeBid(auctionId, amount)
      setAuctions(prev => prev.map(auction => 
        auction.id === auctionId ? updatedAuction : auction
      ))
      return updatedAuction
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const toggleWatchAuction = useCallback(async (auctionId) => {
    try {
      const isWatched = watchedAuctions.includes(auctionId)
      
      if (isWatched) {
        await auctionService.unwatchAuction(auctionId)
        setWatchedAuctions(prev => prev.filter(id => id !== auctionId))
      } else {
        await auctionService.watchAuction(auctionId)
        setWatchedAuctions(prev => [...prev, auctionId])
      }
      
      return !isWatched
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [watchedAuctions])

  const subscribeToAuctionBids = useCallback((auctionId, callback) => {
    subscribeToBids(auctionId, (bidData) => {
      setAuctions(prev => prev.map(auction => 
        auction.id === auctionId 
          ? { 
              ...auction, 
              currentBid: bidData.amount,
              bidsCount: (auction.bidsCount || 0) + 1,
              highestBidder: bidData.bidder 
            }
          : auction
      ))
      callback?.(bidData)
    })

    return () => unsubscribeFromBids(auctionId)
  }, [subscribeToBids, unsubscribeFromBids])

  const processPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionService.processPayment(paymentData)
      
      // Update auction status to sold
      setAuctions(prev => prev.map(auction => 
        auction.id === paymentData.auctionId 
          ? { ...auction, status: 'SOLD' }
          : auction
      ))
      
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const submitReview = useCallback(async (reviewData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionService.submitReview(reviewData)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getReviewsByUser = useCallback((userId) => {
    // This would typically come from the service, but for now filter mock data
    return auctions.flatMap(auction => 
      (auction.reviews || []).filter(review => review.revieweeId === userId)
    )
  }, [auctions])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    // State
    auctions,
    watchedAuctions,
    loading,
    error,
    
    // Actions
    loadAuctions,
    getAuctionById,
    createAuction,
    placeBid,
    toggleWatchAuction,
    subscribeToAuctionBids,
    processPayment,
    submitReview,
    getReviewsByUser,
    clearError,
    
    // WebSocket
    sendBid
  }

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  )
}
