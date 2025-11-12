import { useState } from 'react'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/BidForm.css'

const BidForm = ({ auction, currentBid, onSubmit, loading }) => {
  const { user } = useAuth()
  const [bidAmount, setBidAmount] = useState('')
  const [error, setError] = useState('')

  const calculateMinimumBid = () => {
    const minBid = currentBid + (currentBid * 0.01) 
    return Math.ceil(minBid)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const amount = parseFloat(bidAmount)
    const minBid = calculateMinimumBid()

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount')
      return
    }

    if (amount < minBid) {
      setError(`Bid must be at least $${minBid.toLocaleString()}`)
      return
    }

    if (amount > 1000000) { // Safety limit
      setError('Bid amount is too high')
      return
    }

    onSubmit(amount)
    setBidAmount('')
  }

  const handleBidAmountChange = (e) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setBidAmount(value)
      setError('')
    }
  }

  const quickBidOptions = [1.05, 1.1, 1.2].map(multiplier => ({
    amount: Math.ceil(currentBid * multiplier),
    label: `${multiplier * 100 - 100}% higher`
  }))

  if (!user) {
    return (
      <div className="bid-form">
        <div className="login-prompt">
          <p>Please log in to place a bid</p>
        </div>
      </div>
    )
  }

  if (user.id === auction.sellerId) {
    return (
      <div className="bid-form">
        <div className="seller-notice">
          <p>You cannot bid on your own auction</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bid-form">
      <div className="bid-info">
        <div className="current-bid">
          <span className="label">Current Bid:</span>
          <span className="amount">${currentBid.toLocaleString()}</span>
        </div>
        <div className="minimum-bid">
          Minimum bid: ${calculateMinimumBid().toLocaleString()}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bid-form-content">
        <div className="form-group">
          <label htmlFor="bidAmount" className="bid-label">
            Your Bid ($)
          </label>
          <input
            type="text"
            id="bidAmount"
            value={bidAmount}
            onChange={handleBidAmountChange}
            placeholder={`Enter $${calculateMinimumBid().toLocaleString()} or more`}
            className={error ? 'error' : ''}
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="quick-bids">
          <span className="quick-bid-label">Quick bid:</span>
          {quickBidOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className="quick-bid-btn"
              onClick={() => {
                setBidAmount(option.amount.toString())
                setError('')
              }}
              disabled={loading}
            >
              ${option.amount.toLocaleString()}
              <span className="quick-bid-hint">{option.label}</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large bid-button"
          disabled={loading || !bidAmount || parseFloat(bidAmount) < calculateMinimumBid()}
        >
          {loading ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>

      <div className="bid-terms">
        <p className="terms-text">
          By placing a bid, you agree to our Terms of Service. Winning bids are binding contracts.
        </p>
      </div>
    </div>
  )
}

export default BidForm