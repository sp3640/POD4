import React, { useEffect, useState } from 'react'
// ✅ FIX: Import the new context
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import '../../styles/ReviewList.css'

const ReviewList = ({ username }) => {
  // ✅ FIX: Use the new context
  const { getReviewsByUser, loading } = useAuctionContext()
  
  // ✅ FIX: Add state for async data
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState(null)

  // ✅ FIX: Fetch data in useEffect
  useEffect(() => {
    if (!username) return;
    
    const fetchReviews = async () => {
      try {
        setError(null)
        const userReviews = await getReviewsByUser(username)
        setReviews(userReviews || [])
      } catch (err) {
        setError(err.message)
      }
    }

    fetchReviews()
  }, [username, getReviewsByUser])


  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (reviews.length === 0) return distribution;
    
    reviews.forEach(review => {
      if (distribution[review.rating] !== undefined) {
        distribution[review.rating]++
      }
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()
  const averageRating = calculateAverageRating()

  if (loading) return <div>Loading reviews...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="review-list">
      <div className="review-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating}</div>
          <div className="rating-stars">
            {'★'.repeat(Math.round(averageRating))}
            {'☆'.repeat(5 - Math.round(averageRating))}
          </div>
          <div className="rating-count\">({reviews.length} reviews)</div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="distribution-row">
              <span className="distribution-label">{rating} star</span>
              <div className="distribution-bar">
                <div
                  className="distribution-fill"
                  style={{
                    width: reviews.length > 0 ? `${(ratingDistribution[rating] / reviews.length) * 100}%` : '0%'
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
          <p className="no-reviews">No reviews yet for {username}.</p>
        ) : (
          <div className="reviews">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    {/* Your Review model has 'ReviewerUsername' */}
                    <div className="reviewer-name">{review.reviewerUsername}</div>
                    <div className="review-date">
                      {new Date(review.timestamp).toLocaleDateString()}
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
