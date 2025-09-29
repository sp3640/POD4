import React from 'react'
import { Link } from 'react-router-dom'
import CountdownTimer from '../shared/CountdownTimer'
import { formatCurrency } from '../../utils/formatters'
import '../../styles/AuctionCard.css'

const AuctionCard = ({ auction, onWatchToggle, isWatched = false }) => {
  const {
    id,
    productName,
    imageUrl,
    currentBid,
    startingPrice,
    bidsCount,
    status,
    endTime,
    seller
  } = auction

  const isLive = status === 'LIVE'
  const isEnded = status === 'ENDED'
  const hasBids = bidsCount > 0

  // ✅ Check if auction has expired by comparing endTime with now
  const isExpired = endTime ? new Date(endTime) < new Date() : false

  return (
    <div className={`auction-card ${isEnded || isExpired ? 'ended' : ''}`}>
      <div className="auction-card-image">
        <img 
          src={imageUrl || '/images/placeholder-auction.jpg'} 
          alt={productName}
          loading="lazy"
        />
        <div className="auction-card-status">
          <span className={`status-badge ${status.toLowerCase()}`}>
            {status}
          </span>
        </div>
        <button 
          className={`watch-btn ${isWatched ? 'watched' : ''}`}
          onClick={() => onWatchToggle(id)}
          aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          ♥
        </button>
      </div>

      <div className="auction-card-content">
        <h3 className="auction-title">
          <Link to={`/auction/${id}`}>{productName}</Link>
        </h3>
        
        <div className="auction-seller">
          Seller: {seller?.username || 'Unknown'}
        </div>

        <div className="auction-price">
          <div className="current-bid">
            {hasBids ? formatCurrency(currentBid) : formatCurrency(startingPrice)}
          </div>
          <div className="bid-label">
            {hasBids ? 'Current Bid' : 'Starting Price'}
          </div>
          {hasBids && (
            <div className="bids-count">{bidsCount} bid{bidsCount !== 1 ? 's' : ''}</div>
          )}
        </div>

        {isLive && endTime && (
          <div className="auction-timer">
            <CountdownTimer endTime={endTime} />
          </div>
        )}

        <div className="auction-card-actions">
          <Link to={`/auction/${id}`} className="btn btn-primary">
            {isLive && !isExpired ? 'Place Bid' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
