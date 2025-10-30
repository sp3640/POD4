import AdminDashboard from '../components/dashboard/AdminDashboard'
import BuyerDashboard from '../components/dashboard/BuyerDashboard'
import SellerDashboard from '../components/dashboard/SellerDashboard'
import { useAuth } from '../hooks/auth/useAuth'

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to access your dashboard.</div>
  }

  return (
    <div className="dashboard-page">
      {user.role === 'Admin' && <AdminDashboard />}
      {user.role === 'Buyer' && <BuyerDashboard />}
      {user.role === 'Seller' && <SellerDashboard />}
    </div>
  )
}

export default Dashboard