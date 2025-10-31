// src/components/dashboard/SellerDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuctionContext } from '../../hooks/auction/useAuctionContext';
import { useAuth } from '../../hooks/auth/useAuth';
import '../../styles/Dashboard.css';
import AuctionCard from '../auction/AuctionCard';
import AuctionCreateForm from '../auction/AuctionCreateForm';
// 1. IMPORT THE MODAL
import PaymentReceiptModal from '../payment/PaymentReceiptModal';
import ReviewList from '../reviews/ReviewList';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { auctions, loadAuctions } = useAuctionContext();
  const [activeTab, setActiveTab] = useState('my-auctions');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 2. ADD STATE TO MANAGE WHICH RECEIPT TO SHOW
  const [selectedAuction, setSelectedAuction] = useState(false);

  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  const myAuctions = auctions.filter(auction => auction.sellerUsername === user.username);

  // Assuming statuses: 'Live', 'Upcoming', 'Ended', 'Sold'
  const activeAuctions = myAuctions.filter(auction => auction.status === 'Live');
  const upcomingAuctions = myAuctions.filter(auction => auction.status === 'Upcoming');
  const soldAuctions = myAuctions.filter(auction => auction.status === 'Sold'); // Used for the new 'sold' tab
  const endedAuctions = myAuctions.filter(auction =>
    ['Ended'].includes(auction.status) // Ended but not sold
  );

  // Consolidated ended auctions for the 'my-auctions' tab if you prefer one list:
  // const endedAndSoldAuctions = myAuctions.filter(auction =>
  //   ['Ended', 'Sold'].includes(auction.status)
  // );

  const handleAuctionCreated = () => {
    setShowCreateForm(false);
    loadAuctions();
  };

   const canUserReview = user && 
                    user.role === 'Buyer' || 
                    user.role === 'Seller'

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
          {/* Add the 'Sold Items' tab */}
          <button
            className={activeTab === 'Sold' ? 'active' : ''}
            onClick={() => setActiveTab('Sold')}
          >
            Sold Items
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
            <AuctionCreateForm
              onSuccess={handleAuctionCreated}
              onCancel={() => setShowCreateForm(false)}
            />
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

      {/* The new 'sold' tab content */}
      {activeTab === 'Sold' && (
        <div className="tab-content">
          <h2>Sold Items</h2>
          {soldAuctions.length === 0 ? (
            <p>No items sold yet.</p>
          ) : (
            <div className="auctions-grid">
              {/* 3. UPDATE THE LOOP TO ADD THE BUTTON */}
              {soldAuctions.map(auction => (
                <div key={auction.id} className="auction-card-wrapper">
                  <AuctionCard auction={auction} />
                  {/* ADD THIS BUTTON */}
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => setSelectedAuction(auction)}
                  >
                    View Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
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
                ${myAuctions.reduce((sum, auction) => sum + (auction.highestBid || 0), 0).toLocaleString()}
              </div>
              <div className="stat-label">Total Highest Bids</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {myAuctions.filter(a => a.status === 'Sold').length}
              </div>
              <div className="stat-label">Items Sold</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">N/A</div>
              <div className="stat-label">Total Bids</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD THE MODAL RENDER LOGIC AT THE END */}
      {selectedAuction && (
        <PaymentReceiptModal
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}

      {canUserReview && <ReviewList username={user.username}/>}
    </div>
  );
};

export default SellerDashboard;