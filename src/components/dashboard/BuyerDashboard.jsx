import { useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/Dashboard.css'
import AuctionCard from '../auction/AuctionCard'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const { auctions, watchedAuctions, toggleWatchAuction } = useAuctionContext()
  const [activeTab, setActiveTab] = useState('bidding')

  const biddingAuctions = auctions.filter(auction =>
    auction.bids.some(bid => bid.bidderId === user.id)
  )

  const wonAuctions = auctions.filter(auction =>
    auction.status === 'SOLD' && auction.highestBidderId === user.id
  )

  const watchedAuctionItems = auctions.filter(auction =>
    watchedAuctions.includes(auction.id)
  )

  return (
    <div className="buyer-dashboard">
      <h1>Welcome back, {user.firstName}!</h1>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'bidding' ? 'active' : ''}
          onClick={() => setActiveTab('bidding')}
        >
          Active Bids
        </button>
        <button
          className={activeTab === 'won' ? 'active' : ''}
          onClick={() => setActiveTab('won')}
        >
          Won Auctions
        </button>
        <button
          className={activeTab === 'watchlist' ? 'active' : ''}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist
        </button>
      </div>

      {activeTab === 'bidding' && (
        <div className="tab-content">
          <h2>Your Active Bids</h2>
          {biddingAuctions.length === 0 ? (
            <p>You haven't placed any bids yet.</p>
          ) : (
            <div className="auctions-grid">
              {biddingAuctions.map(auction => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onWatchToggle={toggleWatchAuction}
                  isWatched={watchedAuctions.includes(auction.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'won' && (
        <div className="tab-content">
          <h2>Auctions You've Won</h2>
          {wonAuctions.length === 0 ? (
            <p>You haven't won any auctions yet.</p>
          ) : (
            <div className="auctions-grid">
              {wonAuctions.map(auction => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onWatchToggle={toggleWatchAuction}
                  isWatched={watchedAuctions.includes(auction.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div className="tab-content">
          <h2>Your Watchlist</h2>
          {watchedAuctionItems.length === 0 ? (
            <p>You haven't added any auctions to your watchlist.</p>
          ) : (
            <div className="auctions-grid">
              {watchedAuctionItems.map(auction => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onWatchToggle={toggleWatchAuction}
                  isWatched={watchedAuctions.includes(auction.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BuyerDashboard