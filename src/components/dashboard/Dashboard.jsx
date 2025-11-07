// /*
// From: Dashboard.jsx
// */
// import AdminDashboard from '../components/dashboard/AdminDashboard'
// import BuyerDashboard from '../components/dashboard/BuyerDashboard'
// import SellerDashboard from '../components/dashboard/SellerDashboard'
// import { useAuth } from '../hooks/auth/useAuth'

// const Dashboard = () => {
//   // 1. Get the currently logged-in user
//   const { user } = useAuth()

//   if (!user) {
//     return <div>Please log in to access your dashboard.</div>
//   }

//   // 2. Check the user's role and render the correct component
//   return (
//     <div className="dashboard-page">
//       {user.role === 'Admin' && <AdminDashboard />}
//       {user.role === 'Buyer' && <BuyerDashboard />}
//       {user.role === 'Seller' && <SellerDashboard />}
//     </div>
//   )
// }

// export default Dashboard;