import { useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/Dashboard.css'
import AuctionCard from '../auction/AuctionCard'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const { auctions, watchedAuctions, toggleWatchAuction } = useAuctionContext()
  // 1. Set default tab to 'won'
  const [activeTab, setActiveTab] = useState('won')

  // 2. REMOVED the 'biddingAuctions' filter that would crash the page

  // 3. FIXED 'wonAuctions' filter to use correct properties
  const wonAuctions = auctions.filter(auction =>
    auction.status === 'Sold' && auction.highestBidderUsername === user.username
  )

  const watchedAuctionItems = auctions.filter(auction =>
    watchedAuctions.includes(auction.id)
  )

  return (
    <div className="buyer-dashboard">
      {/* Changed user.firstName to user.username for consistency */}
      <h1>Welcome back, {user.username}!</h1>

      <div className="dashboard-tabs">
        {/* 4. REMOVED the 'Active Bids' button */}
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

      {/* 5. REMOVED the 'activeTab === 'bidding'' content block */}

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