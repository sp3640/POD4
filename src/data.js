// Mock data for development and testing
export const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'BUYER',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'SELLER',
    phone: '+0987654321',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'ADMIN',
    phone: '+1122334455',
    address: {
      street: '789 Admin Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    createdAt: '2024-01-01T08:00:00Z'
  }
]

export const mockAuctions = [
  {
    id: '1',
    productName: 'Vintage Rolex Watch',
    description: 'Beautiful vintage Rolex watch from the 1960s. Fully functional and in excellent condition.',
    startingPrice: 5000,
    currentBid: 7500,
    bidsCount: 12,
    status: 'LIVE',
    category: 'JEWELRY',
    condition: 'USED',
    seller: {
      id: '2',
      username: 'jane.smith'
    },
    highestBidder: {
      id: '1',
      username: 'john.doe'
    },
    imageUrl: '/images/rolex-watch.jpg',
    startTime: '2024-01-20T10:00:00Z',
    endTime: '2024-01-25T15:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    bids: [
      {
        id: '1',
        bidder: { id: '1', username: 'john.doe' },
        amount: 7500,
        time: '2024-01-22T14:30:00Z'
      },
      {
        id: '2',
        bidder: { id: '3', username: 'admin' },
        amount: 7200,
        time: '2024-01-22T14:25:00Z'
      }
    ]
  },
  {
    id: '2',
    productName: 'MacBook Pro 16"',
    description: 'Brand new MacBook Pro 16" with M2 Pro chip. Sealed in box.',
    startingPrice: 2000,
    currentBid: 2200,
    bidsCount: 8,
    status: 'LIVE',
    category: 'ELECTRONICS',
    condition: 'NEW',
    seller: {
      id: '3',
      username: 'admin'
    },
    highestBidder: {
      id: '2',
      username: 'jane.smith'
    },
    imageUrl: '/images/macbook-pro.jpg',
    startTime: '2024-01-18T12:00:00Z',
    endTime: '2024-01-23T12:00:00Z',
    createdAt: '2024-01-10T11:00:00Z',
    bids: [
      {
        id: '3',
        bidder: { id: '2', username: 'jane.smith' },
        amount: 2200,
        time: '2024-01-22T13:45:00Z'
      }
    ]
  },
  {
    id: '3',
    productName: 'Abstract Painting',
    description: 'Original abstract painting by local artist. Dimensions: 24x36 inches.',
    startingPrice: 300,
    currentBid: 450,
    bidsCount: 5,
    status: 'LIVE',
    category: 'ART',
    condition: 'NEW',
    seller: {
      id: '2',
      username: 'jane.smith'
    },
    highestBidder: {
      id: '1',
      username: 'john.doe'
    },
    imageUrl: '/images/abstract-painting.jpg',
    startTime: '2024-01-19T09:00:00Z',
    endTime: '2024-01-24T18:00:00Z',
    createdAt: '2024-01-12T15:30:00Z',
    bids: []
  },
  {
    id: '4',
    productName: 'Vintage Vinyl Collection',
    description: 'Collection of 50 vintage vinyl records from the 60s and 70s. Includes Beatles, Rolling Stones, and more.',
    startingPrice: 800,
    currentBid: 950,
    bidsCount: 7,
    status: 'ENDED',
    category: 'COLLECTIBLES',
    condition: 'USED',
    seller: {
      id: '3',
      username: 'admin'
    },
    highestBidder: {
      id: '2',
      username: 'jane.smith'
    },
    imageUrl: '/images/vinyl-collection.jpg',
    startTime: '2024-01-10T10:00:00Z',
    endTime: '2024-01-20T20:00:00Z',
    createdAt: '2024-01-05T14:00:00Z',
    bids: []
  },
  {
    id: '5',
    productName: 'Designer Handbag',
    description: 'Authentic Louis Vuitton handbag. Limited edition, perfect condition.',
    startingPrice: 1200,
    currentBid: 1200,
    bidsCount: 0,
    status: 'UPCOMING',
    category: 'FASHION',
    condition: 'LIKE_NEW',
    seller: {
      id: '2',
      username: 'jane.smith'
    },
    imageUrl: '/images/designer-handbag.jpg',
    startTime: '2024-01-25T10:00:00Z',
    endTime: '2024-01-30T18:00:00Z',
    createdAt: '2024-01-18T16:45:00Z',
    bids: []
  }
]

export const mockBids = [
  {
    id: '1',
    auctionId: '1',
    bidderId: '1',
    amount: 7500,
    time: '2024-01-22T14:30:00Z'
  },
  {
    id: '2',
    auctionId: '1',
    bidderId: '3',
    amount: 7200,
    time: '2024-01-22T14:25:00Z'
  },
  {
    id: '3',
    auctionId: '2',
    bidderId: '2',
    amount: 2200,
    time: '2024-01-22T13:45:00Z'
  }
]

export const mockReviews = [
  {
    id: '1',
    auctionId: '4',
    reviewerId: '2',
    revieweeId: '3',
    rating: 5,
    comment: 'Excellent seller! The vinyl collection was exactly as described. Fast shipping and great communication.',
    createdAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '2',
    auctionId: '1',
    reviewerId: '1',
    revieweeId: '2',
    rating: 4,
    comment: 'Good experience overall. Watch was beautiful but shipping took a bit longer than expected.',
    createdAt: '2024-01-26T14:30:00Z'
  }
]

// Utility function to generate mock data
export const generateMockData = () => {
  return {
    users: mockUsers,
    auctions: mockAuctions,
    bids: mockBids,
    reviews: mockReviews
  }
}

// Local storage mock data initialization
export const initializeMockData = () => {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
  }
  if (!localStorage.getItem('mockAuctions')) {
    localStorage.setItem('mockAuctions', JSON.stringify(mockAuctions))
  }
  if (!localStorage.getItem('mockBids')) {
    localStorage.setItem('mockBids', JSON.stringify(mockBids))
  }
  if (!localStorage.getItem('mockReviews')) {
    localStorage.setItem('mockReviews', JSON.stringify(mockReviews))
  }
}

// Get mock data from local storage
export const getMockData = () => {
  return {
    users: JSON.parse(localStorage.getItem('mockUsers') || '[]'),
    auctions: JSON.parse(localStorage.getItem('mockAuctions') || '[]'),
    bids: JSON.parse(localStorage.getItem('mockBids') || '[]'),
    reviews: JSON.parse(localStorage.getItem('mockReviews') || '[]')
  }
}

// Update mock data in local storage
export const updateMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}