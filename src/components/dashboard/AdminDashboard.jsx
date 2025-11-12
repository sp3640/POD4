import { useEffect, useState } from 'react'
import { useAuctionContext } from '../../hooks/auction/useAuctionContext'
import { useAuth } from '../../hooks/auth/useAuth'
import '../../styles/Dashboard.css'
import AuctionStats from '../auction/AuctionStats'

const AdminDashboard = () => {
  const { getUsers, allUsers, loading: usersLoading, deleteUser } = useAuth()
  const { auctions, loading: auctionsLoading } = useAuctionContext()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const recentAuctions = auctions.slice(0, 5)
  const recentUsers = allUsers.slice(0, 5)

  if (usersLoading || auctionsLoading) {
    return <div className="loading">Loading dashboard...</div>
  }
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id)
      // getUsers();
    }
  }
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'auctions' ? 'active' : ''}
          onClick={() => setActiveTab('auctions')}
        >
          Auctions
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="tab-content">
          <AuctionStats />

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Recent Auctions</h3>
              {recentAuctions.length === 0 ? (
                <p>No recent auctions</p>
              ) : (
                <div className="recent-list">
                  {recentAuctions.map(auction => (
                    <div key={auction.id} className="recent-item">
                      <div className="item-name">{auction.productName}</div>
                      <div className="item-meta">
                        ${auction.startPrice} • {auction.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-card">
              <h3>Recent Users</h3>
              {recentUsers.length === 0 ? (
                <p>No recent users</p>
              ) : (
                <div className="recent-list">
                  {recentUsers.map(user => (
                    <div key={user.id} className="recent-item">
                      {/* <div className="item-name">{user.username}</div> */}
                      <div className="item-meta">
                        {user.email} • {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="tab-content">
          <div className="dashboard-card">
            <h3>All Users</h3>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    {/* <th>Joined</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      {/* <td>{new Date(user.createdAt).toLocaleDateString()}</td> */}
                      <td>
                        {/* <button className="btn btn-sm">Edit</button> */}
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auctions' && (
        <div className="tab-content">
          <div className="dashboard-card">
            <h3>All Auctions</h3>
            <div className="auctions-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Current Bid</th>
                    <th>Status</th>
                    <th>Ends</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map(auction => (
                    <tr key={auction.id}>
                      <td>{auction.productName}</td>
                      <td>{auction.sellerUsername}</td>
                      <td>${auction.startPrice}</td>
                      <td>
                        {(() => {
                          const now = new Date();
                          const start = new Date(auction.startTime);
                          const end = new Date(auction.endTime);

                          let computedStatus = "UPCOMING";

                          if (now >= start && now <= end) {
                            computedStatus = "LIVE";
                          } else if (now > end) {
                            computedStatus = "ENDED";
                          }

                          return (
                            <span className={`status-badge ${computedStatus.toLowerCase()}`}>
                              {computedStatus}
                            </span>
                          );
                        })()}
                      </td>

                      <td>
                        {auction.endTime ? new Date(auction.endTime).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard