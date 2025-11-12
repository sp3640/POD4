import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import '../../styles/AuctionStats.css'

const AuctionStats = () => {
  const { auctions } = useAuctionContext()
  const now = new Date()

  // Helper to compute status based on time
  const getAuctionStatus = (auction) => {
    const start = new Date(auction.startTime)
    const end = new Date(auction.endTime)

    if (now < start) return 'UPCOMING'
    if (now >= start && now <= end) return 'LIVE'
    if (now > end) return auction.highestBid > 0 ? 'SOLD' : 'ENDED'
    return 'UNKNOWN'
  }

  const stats = {
    total: auctions.length,
    live: auctions.filter(a => getAuctionStatus(a) === 'LIVE').length,
    upcoming: auctions.filter(a => getAuctionStatus(a) === 'UPCOMING').length,
    ended: auctions.filter(a => getAuctionStatus(a) === 'ENDED').length,
    sold: auctions.filter(a => getAuctionStatus(a) === 'SOLD').length,
    totalValue: auctions.reduce((sum, auction) => sum + (auction.startPrice || 0), 0)
  }

  const StatCard = ({ label, value, subtext }) => (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  )

  return (
    <div className="auction-stats">
      <h2>Platform Statistics</h2>
      <div className="stats-grid">
        <StatCard label="Total Auctions" value={stats.total} />
        <StatCard label="Live Auctions" value={stats.live} />
        <StatCard label="Upcoming Auctions" value={stats.upcoming} />
        <StatCard label="Ended Auctions" value={stats.ended} />
        <StatCard label="Sold Items" value={stats.sold} />
        <StatCard 
          label="Total Value" 
          value={`$${stats.totalValue.toLocaleString()}`} 
          subtext="across all auctions"
        />
      </div>
    </div>
  )
}

export default AuctionStats
