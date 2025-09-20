import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAuctions } from '../../hooks/useAuctions'
import '../../styles/PaymentForm.css'

const PaymentForm = ({ auction, onSuccess, onCancel }) => {
  useAuth()
  const { processPayment, loading } = useAuctions()
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
        amount: auction.currentBid,
        paymentMethod,
        cardDetails: paymentMethod === 'credit_card' ? cardDetails : undefined
      }

      await processPayment(paymentData)
      onSuccess?.()
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="payment-form">
      <h2>Complete Payment</h2>
      
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="summary-item">
          <span>Item:</span>
          <span>{auction.productName}</span>
        </div>
        <div className="summary-item">
          <span>Final Price:</span>
          <span>${auction.currentBid.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Tax:</span>
          <span>${(auction.currentBid * 0.08).toFixed(2)}</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>${(auction.currentBid * 1.08).toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-details">
        <div className="form-group">
          <label>Payment Method</label>
          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Bank Transfer
            </label>
          </div>
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="card-details">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="number"
                value={cardDetails.number}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={errors.number ? 'error' : ''}
              />
              {errors.number && <span className="error-text">{errors.number}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={errors.expiry ? 'error' : ''}
                />
                {errors.expiry && <span className="error-text">{errors.expiry}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
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

        {paymentMethod === 'bank_transfer' && (
          <div className="bank-transfer-info">
            <p>Bank transfer details will be provided after order confirmation.</p>
          </div>
        )}

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