import React, { useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'

const ReviewForm = ({ auction, onSuccess, onCancel }) => {
  const { submitReview, loading } = useAuctionContext()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(null)

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
    setSuccess(null) 

    if (!validateForm()) return

    try {
      const reviewData = {
        auctionId: auction.id,
        rating,
        comment: comment.trim(),
        reviewedUsername: auction.sellerUsername,
        reviewType: 'Seller',
      }

      await submitReview(reviewData)

      setErrors({})
      setSuccess('✅ Your review has been submitted successfully!')
      setComment('')
      setRating(5)

      onSuccess?.()
    } catch (error) {
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' })
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
                disabled={loading}
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
            disabled={loading}
          />
          {errors.comment && <span className="error-text">{errors.comment}</span>}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}
        {success && <div className="success-message">{success}</div>}

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
