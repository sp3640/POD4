import { useState } from 'react'
// ✅ FIX: Import the new context
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
// ✅ ADD THIS IMPORT:
import { auctionService } from '../../services/auctionService'
import '../../styles/AuctionCreateForm.css'
import ImageUpload from '../shared/ImageUpload'

const AuctionCreateForm = ({ onSuccess }) => {
  const { user } = useAuth()
  // ✅ FIX: Use the new context and get the API-driven functions
  const { createAuction, loading } = useAuctionContext()

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    startingPrice: '10', // Default value
    category: 'ELECTRONICS', // Default value
    duration: '24', // Default value
    condition: 'NEW' // Default value
  })
  // 'images' state will hold the File objects from ImageUpload
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

  // ✅ REPLACED with your new handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    // 1. Validate form fields (your existing function)
    if (!validateForm()) {
      return;
    }

    // 2. Check if an image was selected
    if (images.length === 0) {
      setErrors({ images: 'An image is required.' });
      return;
    }

    let uploadedImageUrl = '';

    try {
      // 3. Upload the first image
      // This calls auctionService.uploadImage
      console.log('Uploading image:', images);
      const uploadResponse = await auctionService.uploadImage(images[0]);

      if (!uploadResponse.url) {
        throw new Error('Image upload failed to return a URL.');
      }
      // The URL from your UploadController.cs (e.g., http://localhost:5201/uploads/image.jpg)
      uploadedImageUrl = uploadResponse.url;

    } catch (err) {
      console.error('Image upload error:', err);
      setErrors({ submit: `Image Upload Error: ${err.message || 'Check console'}` });
      return; // Stop if upload fails
    }

    try {
      // 4. Prepare the DTO for the AuctionService
      const auctionData = {
        productName: formData.productName,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        // Your form uses 'duration' in hours, the service converts it
        duration: parseInt(formData.duration, 10),
        // Pass the URL from step 3
        imageUrl: uploadedImageUrl
      };

      // 5. Call 'createAuction' from your context/service
      // This calls auctionService.createAuction via your context
      const newAuction = await createAuction(auctionData);

      // 6. Success
      if (onSuccess) {
        onSuccess(newAuction); // Call the prop to close the modal or redirect
      }

    } catch (err) {
      console.error('Auction creation error:', err);
      setErrors({ submit: `Auction Creation Error: ${err.message || 'Check console'}` });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auction-create-form">
      <h2>List a New Item</h2>
      {/* (All your form-group divs remain the same) */}

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
          <label htmlFor="duration">Duration (Hours) *</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="24">24 Hours</option>
            <option value="48">48 Hours</option>
            <option value="72">72 Hours (3 Days)</option>
            I             <option value="168">168 Hours (7 Days)</option>
          </select>
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
            Indentation               <option value="VEHICLES">Vehicles</option>
            <option value="COLLECTIBLES">Collectibles</option>
            <option value="FASHION">Fashion</option>
            ci           <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            s           >
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            ci   <option value="USED">Used</option>
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