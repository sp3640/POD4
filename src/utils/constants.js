// Auction statuses
export const AUCTION_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  LIVE: 'LIVE',
  ENDED: 'ENDED',
  SOLD: 'SOLD',
  CANCELLED: 'CANCELLED'
}

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  BUYER: 'BUYER'
}

// Auction categories
export const CATEGORIES = [
  'ELECTRONICS',
  'ART',
  'JEWELRY',
  'VEHICLES',
  'REAL_ESTATE',
  'COLLECTIBLES',
  'SPORTS',
  'HOME',
  'FASHION',
  'OTHER'
]

// Item conditions
export const CONDITIONS = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  USED: 'Used',
  REFURBISHED: 'Refurbished',
  PARTS: 'For Parts'
}

// Bid increment rules
export const BID_INCREMENT_RULES = [
  { range: [0, 100], increment: 5 },
  { range: [100, 500], increment: 10 },
  { range: [500, 1000], increment: 25 },
  { range: [1000, 5000], increment: 50 },
  { range: [5000, Infinity], increment: 100 }
]

// Auction durations (in hours)
export const DURATION_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 6, label: '6 hours' },
  { value: 12, label: '12 hours' },
  { value: 24, label: '24 hours' },
  { value: 48, label: '48 hours' },
  { value: 72, label: '72 hours' }
]

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  PAYPAL: 'PAYPAL',
  BANK_TRANSFER: 'BANK_TRANSFER'
}

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    USERS: '/auth/users'
  },
  AUCTIONS: {
    BASE: '/auctions',
    BIDS: '/bids',
    WATCH: '/watch',
    REVIEWS: '/reviews'
  },
  PAYMENTS: '/payments'
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
}

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'desc'
}