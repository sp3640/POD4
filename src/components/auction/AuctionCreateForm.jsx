import { useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/AuctionCreateForm.css'
import ImageUpload from '../shared/ImageUpload'

const AuctionCreateForm = ({ onSuccess }) => {
  const { user } = useAuth()
  const { createAuction, loading } = useAuctionContext()
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    startingPrice: '',
    category: '',
    duration: '24',
    condition: 'NEW'
  })
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.productName.trim()) newErrors.productName = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
      newErrors.startingPrice = 'Valid starting price is required'
    }
    if (!formData.category) newErrors.category = 'Category is required'
    if (images.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // helper to convert a File into base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}


  
  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  try {
    // Convert all selected files to base64
    const base64Images = await Promise.all(images.map(file => fileToBase64(file)))

    const auctionData = {
      ...formData,
      startingPrice: parseFloat(formData.startingPrice),
      images: base64Images,   // store base64 strings instead of file paths
      sellerId: user.id || 1
    }

    await createAuction(auctionData)
    onSuccess?.()

    // Reset form
    setFormData({
      productName: '',
      description: '',
      startingPrice: '',
      category: '',
      duration: '24',
      condition: 'NEW'
    })
    setImages([])
    setErrors({})
  } catch (error) {
    setErrors({ submit: error.message })
  }
}


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="auction-create-form">
      <h2>Create New Auction</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="productName">Auction Title *</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className={errors.productName ? 'error' : ''}
              placeholder="Enter product name"
            />
            {errors.productName && <span className="error-text">{errors.productName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="art">Art & Collectibles</option>
              <option value="jewelry">Jewelry</option>
              <option value="vehicles">Vehicles</option>
              <option value="real-estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="startingPrice">Starting Price ($) *</label>
            <input
              type="number"
              id="startingPrice"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleInputChange}
              className={errors.startingPrice ? 'error' : ''}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.startingPrice && <span className="error-text">{errors.startingPrice}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="duration">Auction Duration *</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            >
              <option value="1">1 hour</option>
              <option value="6">6 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="condition">Item Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
            >
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="USED">Used</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={errors.description ? 'error' : ''}
            rows="4"
            placeholder="Describe your item in detail..."
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Images *</label>
          <ImageUpload
            images={images}
            setImages={setImages}
            maxImages={5}
            error={errors.images}
          />
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Creating Auction...' : 'Create Auction'}
        </button>
      </form>
    </div>
  )
}

export default AuctionCreateForm