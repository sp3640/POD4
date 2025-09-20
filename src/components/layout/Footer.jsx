import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>BidHub</h3>
            <p>The premier online auction platform for buying and selling unique items.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/auctions">Auctions</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><a href="/auctions?category=electronics">Electronics</a></li>
              <li><a href="/auctions?category=art">Art & Collectibles</a></li>
              <li><a href="/auctions?category=jewelry">Jewelry</a></li>
              <li><a href="/auctions?category=vehicles">Vehicles</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="LinkedIn">LI</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 BidHub. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/help">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer