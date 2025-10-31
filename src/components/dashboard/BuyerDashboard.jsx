import { useState } from 'react';
import { useAuctionContext } from '../../hooks/auction/useAuctionContext';
import { useAuth } from '../../hooks/auth/useAuth';
import '../../styles/Dashboard.css';
import AuctionCard from '../auction/AuctionCard';
import PaymentReceiptModal from '../payment/PaymentReceiptModal'; // 1. IMPORT THE MODAL
import ReviewList from '../reviews/ReviewList';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { auctions, watchedAuctions, toggleWatchAuction } = useAuctionContext();
  const [activeTab, setActiveTab] = useState('won');

  // 2. ADD STATE TO MANAGE WHICH RECEIPT TO SHOW
  const [selectedAuction, setSelectedAuction] = useState(null);

  const wonAuctions = auctions.filter(auction =>
    auction.status === 'Sold' && auction.highestBidderUsername === user.username
  );

  const watchedAuctionItems = auctions.filter(auction =>
    watchedAuctions.includes(auction.id)
  );
   const canUserReview = user && 
                    user.role === 'Buyer' || 
                    user.role === 'Seller'

  return (
    <div className="buyer-dashboard">
      <h1>Welcome back, {user.username}!</h1>

      <div className="dashboard-tabs">
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

      {activeTab === 'won' && (
        <div className="tab-content">
          <h2>Auctions You've Won</h2>
          {wonAuctions.length === 0 ? (
            <p>You haven't won any auctions yet.</p>
          ) : (
            <div className="auctions-grid">
              {wonAuctions.map(auction => (
                <div key={auction.id} className="auction-card-wrapper">
                  <AuctionCard
                    auction={auction}
                    onWatchToggle={toggleWatchAuction}
                    isWatched={watchedAuctions.includes(auction.id)}
                  />
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

export default BuyerDashboard;