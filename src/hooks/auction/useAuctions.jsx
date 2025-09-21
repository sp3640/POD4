import { useCallback, useState, useEffect } from 'react'
import { useWebSocket } from '../useWebSocket'
import { AuctionContext } from './AuctionContext'
import { mockAuctions as initialMockAuctions } from '../../data' // only for first-time seed

export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([])
  const [watchedAuctions, setWatchedAuctions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { subscribeToBids, unsubscribeFromBids, sendBid } = useWebSocket()

  // Load auctions from localStorage on mount (seed with mockAuctions if empty)
  useEffect(() => {
    const stored = localStorage.getItem('auctions')
    if (stored) {
      setAuctions(JSON.parse(stored))
    } else {
      localStorage.setItem('auctions', JSON.stringify(initialMockAuctions))
      setAuctions(initialMockAuctions)
    }
  }, [])

  const saveToLocalStorage = (data) => {
    localStorage.setItem('auctions', JSON.stringify(data))
    setAuctions(data)
  }

  const loadAuctions = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const stored = JSON.parse(localStorage.getItem('auctions')) || []
      let filtered = stored

      if (filters.category) {
        filtered = filtered.filter(a => a.category === filters.category)
      }

      setAuctions(filtered)
      return filtered
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
      setError(null)

      const stored = JSON.parse(localStorage.getItem('auctions')) || []
      const auction = stored.find(a => a.id === id)

      if (!auction) throw new Error('Auction not found')

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

      const stored = JSON.parse(localStorage.getItem('auctions')) || []
      const now = new Date()
      const startTime = auctionData.startTime || now.toISOString()
      const endTime = auctionData.endTime || new Date(now.getTime() + (auctionData.duration || 24) * 60 * 60 * 1000).toISOString()

      const newAuction = {
        id: (stored.length + 1).toString(),
        productName: auctionData.productName,
        description: auctionData.description,
        startingPrice: auctionData.startingPrice,
        currentBid: auctionData.currentBid ?? auctionData.startingPrice,
        bidsCount: auctionData.bidsCount ?? 0,
        status: auctionData.status || 'LIVE',
        category: auctionData.category,
        condition: auctionData.condition,
        seller: auctionData.seller,
        sellerId:auctionData.sellerId,
        highestBidder: auctionData.highestBidder || null,
        imageUrl: auctionData.imageUrl || '/images/placeholder-auction.jpg',
        startTime,
        endTime,
        createdAt: auctionData.createdAt || now.toISOString(),
        bids: auctionData.bids || []
      }

      const updated = [...stored, newAuction]
      saveToLocalStorage(updated)

      return newAuction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const placeBid = useCallback(async (auctionId, amount, bidder) => {
    try {
      setError(null)
      const stored = JSON.parse(localStorage.getItem('auctions')) || []

      const updated = stored.map(a => {
        if (a.id === auctionId) {
          return {
            ...a,
            currentBid: amount,
            bidsCount: (a.bidsCount || 0) + 1,
            highestBidder: bidder,
            bids: [...(a.bids || []), { id: Date.now().toString(), bidder, amount, time: new Date().toISOString() }]
          }
        }
        return a
      })

      saveToLocalStorage(updated)
      return updated.find(a => a.id === auctionId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const toggleWatchAuction = useCallback((auctionId) => {
    const isWatched = watchedAuctions.includes(auctionId)
    if (isWatched) {
      setWatchedAuctions(prev => prev.filter(id => id !== auctionId))
    } else {
      setWatchedAuctions(prev => [...prev, auctionId])
    }
    return !isWatched
  }, [watchedAuctions])

  const subscribeToAuctionBids = useCallback((auctionId, callback) => {
    subscribeToBids(auctionId, (bidData) => {
      placeBid(auctionId, bidData.amount, bidData.bidder)
      callback?.(bidData)
    })
    return () => unsubscribeFromBids(auctionId)
  }, [subscribeToBids, unsubscribeFromBids, placeBid])

  const processPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true)
      setError(null)
      const stored = JSON.parse(localStorage.getItem('auctions')) || []

      const updated = stored.map(a =>
        a.id === paymentData.auctionId ? { ...a, status: 'SOLD' } : a
      )

      saveToLocalStorage(updated)
      return { success: true }
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
      const stored = JSON.parse(localStorage.getItem('auctions')) || []

      const updated = stored.map(a => {
        if (a.id === reviewData.auctionId) {
          return {
            ...a,
            reviews: [...(a.reviews || []), reviewData]
          }
        }
        return a
      })

      saveToLocalStorage(updated)
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getReviewsByUser = useCallback((userId) => {
    const stored = JSON.parse(localStorage.getItem('auctions')) || []
    return stored.flatMap(auction =>
      (auction.reviews || []).filter(review => review.revieweeId === userId)
    )
  }, [])

  const clearError = useCallback(() => setError(null), [])

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
    subscribeToAuctionBids,
    processPayment,
    submitReview,
    getReviewsByUser,
    clearError,
    sendBid
  }

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  )
}
