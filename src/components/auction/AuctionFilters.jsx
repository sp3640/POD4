import React from 'react'
import '../../styles/AuctionFilters.css'

const AuctionFilters = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max
    })
  }

  const clearFilters = () => {
    onFilterChange({
      category: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'ending_soon'
    })
  }

  return (
    <div className="auction-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="clear-filters">
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="art">Art & Collectibles</option>
          <option value="jewelry">Jewelry</option>
          <option value="vehicles">Vehicles</option>
          <option value="real-estate">Real Estate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="LIVE">Live</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ENDED">Ended</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceRangeChange(e.target.value, filters.maxPrice)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="sortBy">Sort By</label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
        >
          <option value="ending_soon">Ending Soon</option>
          <option value="newest">Newest</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
          <option value="most_bids">Most Bids</option>
        </select>
      </div>
    </div>
  )
}

export default AuctionFilters