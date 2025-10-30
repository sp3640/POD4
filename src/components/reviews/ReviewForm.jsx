import React, { useState } from 'react'
// ✅ FIX: Import the new context
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import '../../styles/ReviewForm.css'

const ReviewForm = ({ auction, onSuccess, onCancel }) => {
  // ✅ FIX: Use the new context
  const { submitReview, loading } = useAuctionContext()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (rating < 1 || rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5'
    }
    if (!comment.trim()) {
      newErrors.comment = 'Comment is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const reviewData = {
        auctionId: auction.id,
        rating,
        comment: comment.trim(),
        // ✅ FIX: Your DTO expects 'ReviewedUsername'
        reviewedUsername: auction.sellerUsername, 
        reviewType: 'Seller' // You are reviewing the seller
      }

      await submitReview(reviewData)
      onSuccess?.()
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  return (
    <div className="review-form">
      <h3>Leave a Review</h3>
      <p>You are reviewing the seller: <strong>{auction.sellerUsername}</strong></p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this seller..."
            rows="4"
            className={errors.comment ? 'error' : ''}
          />
          {errors.comment && <span className="error-text">{errors.comment}</span>}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="review-actions">
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
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
