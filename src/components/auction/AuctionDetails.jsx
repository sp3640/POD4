import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/AuctionDetails.css'
import CountdownTimer from '../shared/CountdownTimer'
import BidForm from './BidForm'

const AuctionDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { getAuctionById, placeBid, loading } = useAuctionContext()
  const [auction, setAuction] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const auctionData = await getAuctionById(id)
        setAuction(auctionData)
      } catch (err) {
        setError('Failed to load auction details')
        console.error('Error fetching auction:', err)
      }
    }

    if (id) {
      fetchAuction()
    }
  }, [id, getAuctionById])

  const handleBid = async (amount) => {
    setError('')
    setMessage('')

    try {
      if (isNaN(amount) || amount <= auction.currentBid) {
        setError('Bid must be higher than current bid')
        return
      }

      const updatedAuction = await placeBid(auction.id, amount)
      setAuction(updatedAuction)
      setMessage('Bid placed successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to place bid')
    }
  }

  if (!auction) {
    if (error) {
      return <div className="error">Error: {error}</div>
    }
    return <div className="loading">Loading auction details...</div>
  }

  const canUserBid = user && 
                    user.role === 'BUYER' && 
                    user.id !== auction.sellerId && 
                    auction.status === 'LIVE'

  return (
    <div className="auction-details">
      <div className="auction-details-header">
        <h1>{auction.productName}</h1>
        <div className={`status-badge ${auction.status.toLowerCase()}`}>
          {auction.status}
        </div>
      </div>

      <div className="auction-details-content">
        <div className="auction-images">
          <div className="main-image">
            <img src={auction.imageUrl || '/images/placeholder-auction.jpg'} alt={auction.productName} />
          </div>
          {auction.images && auction.images.length > 1 && (
            <div className="thumbnail-images">
              {auction.images.slice(1).map((image, index) => (
                <img key={index} src={image} alt={`${auction.productName} ${index + 2}`} />
              ))}
            </div>
          )}
        </div>

        <div className="auction-info">
          <div className="auction-meta">
            <div className="seller-info">
              <strong>Seller:</strong> {auction.seller?.username || 'Unknown'}
            </div>
            <div className="category">
              <strong>Category:</strong> {auction.category}
            </div>
            <div className="condition">
              <strong>Condition:</strong> {auction.condition}
            </div>
            <div className="created-date">
              <strong>Listed:</strong> {new Date(auction.createdAt).toLocaleDateString()}
            </div>
            {auction.endTime && (
              <div className="end-date">
                <strong>Ends:</strong> {new Date(auction.endTime).toLocaleString()}
              </div>
            )}
          </div>

          <div className="bid-info">
            <div className="current-bid">
              <span className="label">Current Bid:</span>
              <span className="amount">${auction.currentBid.toFixed(2)}</span>
            </div>
            <div className="bids-count">
              {auction.bidsCount} bid{auction.bidsCount !== 1 ? 's' : ''}
            </div>
            {auction.highestBidder && (
              <div className="highest-bidder">
                Highest bidder: {auction.highestBidder.username}
              </div>
            )}
            {auction.startingPrice && (
              <div className="starting-price">
                Starting price: ${auction.startingPrice.toFixed(2)}
              </div>
            )}
          </div>

          {auction.status === 'LIVE' && auction.endTime && (
            <div className="timer-section">
              <CountdownTimer endTime={auction.endTime} />
            </div>
          )}

          {canUserBid ? (
            <BidForm
              auction={auction}
              currentBid={auction.currentBid}
              onSubmit={handleBid}
              loading={loading}
            />
          ) : auction.status === 'LIVE' && user && user.id === auction.sellerId ? (
            <div className="seller-notice">
              <p>You cannot bid on your own auction</p>
            </div>
          ) : auction.status === 'LIVE' && !user ? (
            <div className="login-prompt">
              <p>Please log in to place a bid</p>
            </div>
          ) : auction.status !== 'LIVE' ? (
            <div className="auction-ended">
              <p>This auction has ended</p>
              {auction.status === 'SOLD' && auction.highestBidder && (
                <p>Sold to {auction.highestBidder.username} for ${auction.currentBid.toFixed(2)}</p>
              )}
            </div>
          ) : null}

          {message && <div className="message success">{message}</div>}
          {error && <div className="message error">{error}</div>}
        </div>
      </div>

      <div className="auction-description">
        <h3>Description</h3>
        <p>{auction.description}</p>
      </div>

      <div className="bid-history">
        <h3>Bid History</h3>
        {auction.bids && auction.bids.length > 0 ? (
          <div className="bids-list">
            {auction.bids.map((bid, index) => (
              <div key={bid.id || index} className="bid-item">
                <div className="bidder-info">
                  <div className="bidder">{bid.bidder?.username || 'Unknown'}</div>
                  <div className="bid-time">{new Date(bid.time).toLocaleString()}</div>
                </div>
                <div className="bid-amount">${bid.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-bids">No bids yet</p>
        )}
      </div>

      {/* Additional auction details */}
      <div className="auction-extra-info">
        <h3>Auction Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Auction ID:</strong> {auction.id}
          </div>
          <div className="info-item">
            <strong>Status:</strong> {auction.status}
          </div>
          <div className="info-item">
            <strong>Created:</strong> {new Date(auction.createdAt).toLocaleString()}
          </div>
          {auction.updatedAt && (
            <div className="info-item">
              <strong>Last Updated:</strong> {new Date(auction.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionDetails