import React from 'react'
import { useAuctions } from '../../hooks/useAuctions'
import '../../styles/ReviewList.css'

const ReviewList = ({ userId }) => {
  const { getReviewsByUser } = useAuctions()
  const reviews = getReviewsByUser(userId)

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating]++
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="review-list">
      <div className="review-summary">
        <div className="average-rating">
          <div className="rating-number">{calculateAverageRating()}</div>
          <div className="rating-stars">
            {'★'.repeat(Math.round(calculateAverageRating()))}
            {'☆'.repeat(5 - Math.round(calculateAverageRating()))}
          </div>
          <div className="rating-count">({reviews.length} reviews)</div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="distribution-row">
              <span className="rating-label">{rating} stars</span>
              <div className="distribution-bar">
                <div
                  className="distribution-fill"
                  style={{
                    width: `${(ratingDistribution[rating] / reviews.length) * 100}%`
                  }}
                ></div>
              </div>
              <span className="distribution-count">{ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-container">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet.</p>
        ) : (
          <div className="reviews">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-name">{review.reviewer.username}</div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewList