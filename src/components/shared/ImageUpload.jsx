import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import '../../styles/ImageUpload.css'

const ImageUpload = ({ images, setImages, maxImages = 5, error }) => {
  const [previewUrls, setPreviewUrls] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setImages(prev => [...prev, ...acceptedFiles])
    setPreviewUrls(prev => [...prev, ...newImages])
  }, [images.length, maxImages, setImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const removeImage = (index) => {
    const newImages = [...images]
    const newPreviews = [...previewUrls]
    
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setImages(newImages)
    setPreviewUrls(newPreviews)
  }

  return (
    <div className="image-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <div className="upload-icon">📁</div>
          <p>
            {isDragActive
              ? 'Drop the images here...'
              : 'Drag & drop images here, or click to select'
            }
          </p>
          <span className="upload-hint">
            Supports JPG, PNG, GIF • Max 5MB per image
          </span>
        </div>
      </div>

      {error && <span className="error-text">{error}</span>}

      {previewUrls.length > 0 && (
        <div className="image-previews">
          {previewUrls.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview.preview} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="remove-image"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {previewUrls.length > 0 && (
        <div className="upload-stats">
          {previewUrls.length} of {maxImages} images selected
        </div>
      )}
    </div>
  )
}

export default ImageUpload