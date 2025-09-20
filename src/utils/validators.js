// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber) => {
  let sum = 0
  let shouldDouble = false
  
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '')
  
  // Loop through digits from right to left
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i))
    
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    shouldDouble = !shouldDouble
  }
  
  return sum % 10 === 0
}

// Expiry date validation
export const isValidExpiryDate = (expiry) => {
  const [month, year] = expiry.split('/').map(Number)
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  
  if (!month || !year || month < 1 || month > 12) {
    return false
  }
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }
  
  return true
}

// CVV validation
export const isValidCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv)
}

// Required field validation
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== ''
}

// Minimum length validation
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

// Maximum length validation
export const hasMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength
}

// Number range validation
export const isInRange = (value, min, max) => {
  const num = Number(value)
  return !isNaN(num) && num >= min && num <= max
}

// Date validation (must be in the future)
export const isFutureDate = (date) => {
  return new Date(date) > new Date()
}

// Auction bid validation
export const isValidBid = (bidAmount, currentBid) => {
  const bid = Number(bidAmount)
  const current = Number(currentBid)
  
  if (isNaN(bid) || bid <= 0) {
    return false
  }
  
  // Bid must be at least 1% higher than current bid
  const minBid = current + (current * 0.01)
  return bid >= minBid
}

// Image file validation
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {}
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = values[field]
    
    fieldRules.forEach(rule => {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} is required`
        return
      }
      
      if (rule.minLength && !hasMinLength(value, rule.minLength)) {
        errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`
        return
      }
      
      if (rule.maxLength && !hasMaxLength(value, rule.maxLength)) {
        errors[field] = rule.message || `${field} must be at most ${rule.maxLength} characters`
        return
      }
      
      if (rule.type === 'email' && !isValidEmail(value)) {
        errors[field] = rule.message || 'Invalid email address'
        return
      }
      
      if (rule.type === 'password' && !isValidPassword(value)) {
        errors[field] = rule.message || 'Password must be at least 8 characters with uppercase, lowercase, and number'
        return
      }
    })
  })
  
  return errors
}