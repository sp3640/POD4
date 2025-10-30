import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuctionCard from '../components/auction/AuctionCard'
import { useAuctionContext } from '../hooks/auction/useAuctionContext'
import { useAuth } from '../hooks/auth/useAuth' // ✅ 1. IMPORT useAuth
import '../styles/Home.css'

const Home = () => {
  const { auctions, loading, loadAuctions } = useAuctionContext()
  const { isAuthenticated } = useAuth() // ✅ 2. GET user auth status

  useEffect(() => {
    // Your backend doesn't support filters yet, so we load all
    loadAuctions()
  }, [loadAuctions])

  // Get the first 6 auctions
  const featuredAuctions = auctions.slice(0, 6)

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Unique Items at Amazing Prices</h1>
          <p>Bid on exclusive items from around the world. Join thousands of buyers and sellers in our vibrant auction community.</p>
          <div className="hero-actions">
            <Link to="/auctions" className="btn btn-primary btn-large">
              Browse Auctions
            </Link>
            
            {/* ✅ 3. FIX: Link to dashboard if logged in, otherwise register */}
            <Link 
              to={isAuthenticated ? "/dashboard" : "/register"} 
              className="btn btn-secondary btn-large"
            >
              Start Selling
            </Link>
          </div>
        </div>
        <div className="hero-image">
          {/* Using a placeholder as the path 'public/home.png' might be incorrect */}
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
                  // These functions don't exist yet, so we pass placeholders
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
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>Create your free account in seconds</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse or List</h3>
              <p>Find amazing items or sell your own</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Bid & Win</h3>
              <p>Place bids and win great deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2>Popular Categories</h2>
          <div className="category-grid">
            <div className="category-card">
              <img src="src/assets/chip.png" alt="Electronics" />
              <h3>Electronics</h3>
            </div>
            <div className="category-card">
              <img src="src/assets/art.png" alt="Art & Collectibles" />
              <h3>Art & Collectibles</h3>
            </div>
            <div className="category-card">
              <img src="src/assets/jewellery.png" alt="Jewelry" />
              <h3>Jewelry</h3>
            </div>
            <div className="category-card">
              <img src="src/assets/vehicle.png" alt="Vehicles" />
              <h3>Vehicles</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
