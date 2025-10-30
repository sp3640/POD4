import { useState, useEffect } from 'react'; // Import useEffect
import { useAuctionContext } from '../../hooks/auction/useAuctionContext';
import { useAuth } from '../../hooks/auth/useAuth';
import '../../styles/Dashboard.css';
import AuctionCard from '../auction/AuctionCard';
import AuctionCreateForm from '../auction/AuctionCreateForm';

const SellerDashboard = () => {
  const { user } = useAuth();
  // ✅ FIX: Get loadAuctions function
  const { auctions, loadAuctions } = useAuctionContext(); 
  const [activeTab, setActiveTab] = useState('my-auctions');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ✅ FIX: Load auctions specifically for this dashboard if needed
  useEffect(() => {
    // Optionally re-load auctions when the dashboard mounts
    // or rely on the initial load in AuctionProvider
     loadAuctions(); 
  }, [loadAuctions]);


  // ✅ FIX: Filter using the correct fields (auction.sellerUsername and user.username)
  const myAuctions = auctions.filter(auction => auction.sellerUsername === user.username);

  // NOTE: Your backend Auction model might not have 'status' yet.
  // Assuming 'LIVE', 'ENDED', 'SOLD' statuses exist for filtering.
  // If not, these filters won't work correctly.
  const activeAuctions = myAuctions.filter(auction => auction.status === 'Live'); // Match backend ('Live')
  const upcomingAuctions = myAuctions.filter(auction => auction.status === 'Upcoming'); // Or whatever your backend uses
  const endedAuctions = myAuctions.filter(auction =>
    ['Ended', 'Sold'].includes(auction.status) // Match backend ('Ended', 'Sold')
  );

  const handleAuctionCreated = () => {
    setShowCreateForm(false);
    // ✅ FIX: Refresh auctions list after creating one
    loadAuctions(); 
  };

  // --- No changes needed below this line in the return statement ---
  // The button and modal logic were already correct.

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

        {/* This button's logic is correct */}
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Auction 
        </button>
      </div>

      {/* This modal logic is correct */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
             {/* Pass onCancel to allow closing */}
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
                  // Assuming AuctionCard handles missing props gracefully
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
                 {/* ✅ FIX: Use highestBid which exists on backend model */}
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
               {/* Note: bidsCount doesn't exist on backend model */}
              <div className="stat-value">N/A</div>
              <div className="stat-label">Total Bids</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
