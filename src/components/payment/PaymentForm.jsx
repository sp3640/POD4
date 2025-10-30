import React, { useState } from 'react'
// ✅ FIX: Import the new context
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
// ✅ FIX: Import useAuth from the correct path
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/PaymentForm.css'

const PaymentForm = ({ auction, onSuccess, onCancel }) => {
  useAuth() // This line is fine
  // ✅ FIX: Use the new context
  const { processPayment, loading } = useAuctionContext() 
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (paymentMethod === 'credit_card') {
      if (!cardDetails.number.trim()) newErrors.number = 'Card number is required'
      if (!cardDetails.expiry.trim()) newErrors.expiry = 'Expiry date is required'
      if (!cardDetails.cvv.trim()) newErrors.cvv = 'CVV is required'
      if (!cardDetails.name.trim()) newErrors.name = 'Cardholder name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const paymentData = {
        auctionId: auction.id,
        // This is a simplified DTO, your backend PaymentDto is more specific
        cardNumber: cardDetails.number,
        expirationDate: cardDetails.expiry,
        cvv: cardDetails.cvv,
        paymentMethod: paymentMethod,
      }

      await processPayment(paymentData)
      onSuccess?.()
    } catch (error) {
      setErrors({ submit: error.message || "Payment failed" })
    }
  }

  // ... (rest of your return JSX is fine)
  return (
    <div className="payment-form">
      <h3>Pay for Auction</h3>
      <p>You are paying for: <strong>{auction.productName}</strong></p>
      
      <form onSubmit={handleSubmit}>
        <div className="payment-total">
          <span>Final Price (incl. fees):</span>
          {/* Example 8% fee */}
          <strong>${(auction.currentBid * 1.08).toFixed(2)}</strong> 
        </div>

        {/* (All your form-group divs for paymentMethod, cardDetails, etc. remain the same) */}

        <div className="form-group">
          <label>Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="credit-card-fields">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="number"
                value={cardDetails.number}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                className={errors.number ? 'error' : ''}
              />
              {errors.number && <span className="error-text">{errors.number}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardExpiry">Expiry (MM/YY)</label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={errors.expiry ? 'error' : ''}
                />
                {errors.expiry && <span className="error-text">{errors.expiry}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="cardCvv">CVV</label>
                <input
                  type="text"
                  id="cardCvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="error-text">{errors.cvv}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                type="text"
                id="cardName"
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="paypal-info">
            <p>You will be redirected to PayPal to complete your payment.</p>
          </div>
        )}
        
        {/* ... other payment methods ... */}

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="payment-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay $${(auction.currentBid * 1.08).toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm
