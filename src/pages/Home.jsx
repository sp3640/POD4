import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuctionCard from '../components/auction/AuctionCard'
import { useAuctionContext } from '../hooks/auction/useAuctionContext'
import '../styles/Home.css'

const Home = () => {
  const { auctions, loading, loadAuctions } = useAuctionContext()

  useEffect(() => {
    loadAuctions({ status: 'LIVE', limit: 6 })
  }, [loadAuctions])

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
            <Link to="/register" className="btn btn-secondary btn-large">
              Start Selling
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-auction.jpg" alt="Auction items" />
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="featured-auctions">
        <div className="container">
          <h2>Featured Auctions</h2>
          {loading ? (
            <div className="loading">Loading featured auctions...</div>
          ) : (
            <div className="auctions-grid">
              {featuredAuctions.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/auctions" className="btn btn-outline">
              View All Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
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
              <img src="/images/electronics.jpg" alt="Electronics" />
              <h3>Electronics</h3>
            </div>
            <div className="category-card">
              <img src="/images/art.jpg" alt="Art & Collectibles" />
              <h3>Art & Collectibles</h3>
            </div>
            <div className="category-card">
              <img src="/images/jewelry.jpg" alt="Jewelry" />
              <h3>Jewelry</h3>
            </div>
            <div className="category-card">
              <img src="/images/vehicles.jpg" alt="Vehicles" />
              <h3>Vehicles</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home