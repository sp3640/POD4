import { useState } from 'react'

import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'

import { auctionService } from '../../services/auctionService'
import '../../styles/AuctionCreateForm.css'
import ImageUpload from '../shared/ImageUpload'
 
const AuctionCreateForm = ({ onSuccess }) => {
  const { user } = useAuth()
  
  const { createAuction, loading } = useAuctionContext()
 
  
  const [formData, setFormData] = useState({
  productName: '',
  description: '',
  startingPrice: '10',
  category: 'ELECTRONICS',
  duration: '24',
  condition: 'NEW',
  startTime: new Date().toISOString(), 
  endTime: '' 
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
 
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 
 
    
    if (!validateForm()) {
      return;
    }
 
    
    if (images.length === 0) {
      setErrors({ images: 'An image is required.' });
      return;
    }
 
    let uploadedImageUrl = '';
 
    try {
      
      
      console.log('Uploading image:', images);
      const uploadResponse = await auctionService.uploadImage(images[0]);
 
      if (!uploadResponse.url) {
        throw new Error('Image upload failed to return a URL.');
      }
      
      uploadedImageUrl = uploadResponse.url;
 
    } catch (err) {
      console.error('Image upload error:', err);
      setErrors({ submit: `Image Upload Error: ${err.message || 'Check console'}` });
      return; 
    }
 
    try {
      
      const auctionData = {
        productName: formData.productName,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        
        duration: parseInt(formData.duration),
        
        imageUrl: uploadedImageUrl
      };
 
      
      
      const newAuction = await createAuction(auctionData);
 
      
      if (onSuccess) {
        onSuccess(newAuction); 
      }
 
    } catch (err) {
      console.error('Auction creation error:', err);
      setErrors({ submit: `Auction Creation Error: ${err.message || 'Check console'}` });
    }
  };
 
  return (
    <form onSubmit={handleSubmit} className="auction-create-form">
      <h2>List a New Item</h2>
      {/* (All  form-group divs ) */}
 
      <div className="form-group">
        <label htmlFor="productName">Title *</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          className={errors.productName ? 'error' : ''}
          placeholder="e.g. Vintage Leather Jacket"
        />
        {errors.productName && <span className="error-text">{errors.productName}</span>}
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startingPrice">Starting Price *</label>
          <input
            type="number"
            id="startingPrice"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleInputChange}
            className={errors.startingPrice ? 'error' : ''}
            placeholder="10.00"
          />
          {errors.startingPrice && <span className="error-text">{errors.startingPrice}</span>}
        </div>
 
        <div className="form-group">
          <label htmlFor="duration">Duration (Minutes) *</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Enter duration in minutes"
            min="1"
          />
        </div>
 
      </div>
 
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            cm className={errors.category ? 'error' : ''}
          >
            <option value="">Select Category</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="ART">Art</option>
            <option value="JEWELRY">Jewelry</option>
            Indentation               <option value="VEHICLES">Vehicles</option>
            <option value="COLLECTIBLES">Collectibles</option>
            <option value="FASHION">Fashion</option>
            ci           <option value="OTHER">Other</option>
          </select>
        </div>
 
        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            s           >
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            ci   <option value="USED">Used</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>
        </div>
      </div>
 
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          Indentation value={formData.description}
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
          A maxImages={5}
          error={errors.images}
        />
        {errors.images && <span className="error-text">{errors.images}</span>}
      </div>
 
      {errors.submit && <div className="error-message">{errors.submit}</div>}
 
      <button
        type="submit"
        className="btn btn-primary btn-large"
        Indentation disabled={loading}
      >
        {loading ? 'Creating Auction...' : 'Create Auction'}
      </button>
    </form>
  )
}
 
export default AuctionCreateForm