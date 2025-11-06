import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuctionCard from '../components/auction/AuctionCard'
import { useAuctionContext } from '../hooks/auction/useAuctionContext'
import { useAuth } from '../hooks/auth/useAuth'
import '../styles/Home.css'

const Home = () => {
  const { auctions, loading, loadAuctions } = useAuctionContext()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadAuctions()
  }, [loadAuctions])

  const featuredAuctions = auctions.slice(0, 6)

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        {/* --- VIDEO BACKGROUND START --- */}
        <video
          className="hero-background-video"
          // This path works because 'public/VID1.mp4' is served as '/VID1.mp4'
          src="/VID1.mp4" 
          autoPlay
          loop
          muted
          playsInline
        />
        {/* This overlay dims the video so text is readable */}
        <div className="hero-overlay"></div>
        {/* --- VIDEO BACKGROUND END --- */}

        {/* Your original hero content. 
          The new CSS will make sure this sits on top.
        */}
        <div className="hero-content">
          <h1>Discover Unique Items at Amazing Prices</h1>
          <p>Bid on exclusive items from around the world. Join thousands of buyers and sellers in our vibrant auction community.</p>
          <div className="hero-actions">
            <Link to="/auctions" className="btn btn-primary btn-large">
              Browse Auctions
            </Link>
            
            <Link 
              to={isAuthenticated ? "/dashboard" : "/register"} 
              className="btn btn-secondary btn-large"
            >
              Start Selling
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="public/home.png" 
            alt="Auction items" 
            onError={(e) => e.target.src = 'https://placehold.co/600x400'}
          />
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="featured-auctions">
        <div className="container">
          <h2>Featured Auctions</h2>
          {loading ? (
            <div>Loading auctions...</div>
          ) : (
            <div className="auctions-grid">
              {featuredAuctions.map(auction => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onWatchToggle={() => {}} 
                  isWatched={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        {/* ... content ... */}
      </section>

      {/* Categories */}
      <section className="categories">
        {/* ... content ... */}
      </section>
    </div>
  )
}

export default Home