import { useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/Dashboard.css'
import AuctionCard from '../auction/AuctionCard'
import AuctionCreateForm from '../auction/AuctionCreateForm'

const SellerDashboard = () => {
  const { user } = useAuth()
  const { auctions } = useAuctionContext()
  const [activeTab, setActiveTab] = useState('my-auctions')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const myAuctions = auctions.filter(auction => auction.sellerId === user.id)

  const activeAuctions = myAuctions.filter(auction => auction.status === 'LIVE')
  const upcomingAuctions = myAuctions.filter(auction => auction.status === 'UPCOMING')
  const endedAuctions = myAuctions.filter(auction => 
    ['ENDED', 'SOLD'].includes(auction.status)
  )

  const handleAuctionCreated = () => {
    setShowCreateForm(false)
    // Refresh auctions list
  }

  return (
    <div className="seller-dashboard">
      <h1>Seller Dashboard</h1>

      <div className="dashboard-header">
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'my-auctions' ? 'active' : ''}
            onClick={() => setActiveTab('my-auctions')}
          >
            My Auctions
          </button>
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Auction
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AuctionCreateForm onSuccess={handleAuctionCreated} />
            <button
              className="modal-close"
              onClick={() => setShowCreateForm(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {activeTab === 'my-auctions' && (
        <div className="tab-content">
          <div className="auctions-section">
            <h2>Active Auctions ({activeAuctions.length})</h2>
            {activeAuctions.length === 0 ? (
              <p>You don't have any active auctions.</p>
            ) : (
              <div className="auctions-grid">
                {activeAuctions.map(auction => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>

          <div className="auctions-section">
            <h2>Upcoming Auctions ({upcomingAuctions.length})</h2>
            {upcomingAuctions.length === 0 ? (
              <p>You don't have any upcoming auctions.</p>
            ) : (
              <div className="auctions-grid">
                {upcomingAuctions.map(auction => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>

          <div className="auctions-section">
            <h2>Ended Auctions ({endedAuctions.length})</h2>
            {endedAuctions.length === 0 ? (
              <p>You don't have any ended auctions.</p>
            ) : (
              <div className="auctions-grid">
                {endedAuctions.map(auction => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{myAuctions.length}</div>
              <div className="stat-label">Total Auctions</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                ${myAuctions.reduce((sum, auction) => sum + auction.currentBid, 0).toLocaleString()}
              </div>
              <div className="stat-label">Total Value</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {myAuctions.filter(a => a.status === 'SOLD').length}
              </div>
              <div className="stat-label">Items Sold</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {myAuctions.reduce((sum, auction) => sum + auction.bidsCount, 0)}
              </div>
              <div className="stat-label">Total Bids</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerDashboard