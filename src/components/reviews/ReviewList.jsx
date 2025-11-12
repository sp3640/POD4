
import React, { useEffect, useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'


const ReviewList = ({ username }) => {
  const { getReviewsByUser, loading } = useAuctionContext()
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState(null)

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
    reviews.forEach(review => {
      if (distribution[review.rating] !== undefined) {
        distribution[review.rating]++
      }
    })
    return distribution
  }

  if (loading && reviews.length === 0) {
    return <div className="loading">Loading reviews...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }
  
  const averageRating = calculateAverageRating()
  const ratingDistribution = getRatingDistribution()

  return (
    <div className="review-list">
      <h2>Reviews for {username}</h2>
      
      <div className="review-summary">
        <div className="summary-average">
          <div className="average-rating-value">{averageRating}</div>
          <div className="average-rating-stars">
            
          </div>
          <div className="total-reviews">{reviews.length} reviews</div>
        </div>

        <div className="summary-distribution">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="distribution-row">
              <span className="distribution-label">{rating} star</span>
              <div className="distribution-bar-container">
                <div 
                  className="distribution-bar"
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
                    <div className="reviewer-name">{review.reviewerUsername}</div>
                    <div className="review-date">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  
                  <div className="review-rating">
                    <span className="stars-filled">{'★'.repeat(review.rating)}</span>
                    <span className="stars-empty">{'☆'.repeat(5 - review.rating)}</span>
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