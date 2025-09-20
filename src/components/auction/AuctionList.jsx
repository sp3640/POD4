import { useEffect, useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import '../../styles/AuctionList.css'
import AuctionCard from './AuctionCard'
import AuctionFilters from './AuctionFilters'

const AuctionList = () => {
  const { auctions, loading, error, loadAuctions, toggleWatchAuction, watchedAuctions } = useAuctionContext()
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'ending_soon'
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAuctions(filters)
  }, [filters, loadAuctions])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredAuctions = auctions.filter(auction =>
    auction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && auctions.length === 0) {
    return <div className="loading">Loading auctions...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="auction-list">
      <div className="auction-list-header">
        <h1>Live Auctions</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search auctions"
          />
        </div>
      </div>

      <div className="auction-list-content">
        <aside className="filters-sidebar">
          <AuctionFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="auctions-grid">
          {filteredAuctions.length === 0 ? (
            <div className="no-auctions">
              <h3>No auctions found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredAuctions.map(auction => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onWatchToggle={toggleWatchAuction}
                isWatched={watchedAuctions.includes(auction.id)}
              />
            ))
          )}
        </main>
      </div>
    </div>
  )
}

export default AuctionList