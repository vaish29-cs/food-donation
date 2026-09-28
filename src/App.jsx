import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './Pages/MainPage/MainPage'
import Login from './Pages/auth/Login'
import Register from './Pages/auth/Register'
import DonorDashboard from './Pages/donor/DonorDashboard'
import DonateFood from './Pages/donor/DonateFood'
import IncomingRequests from './Pages/donor/IncomingRequests'
import Admin from './Pages/admin/Admin'
import AdminRegister from './Pages/admin/AdminRegister'
import AdminUserDetails from './Pages/admin/AdminUserDetails'
import ReceiverDashboard from './Pages/reciever/ReceiverDashboard'
import AvailableFood from './Pages/reciever/AvailableFood'
import ReceiveFood from './Pages/reciever/ReceiveFood'
import RequestStatus from './Pages/reciever/RequestStatus'
import About from './Pages/info/About'
import HowItWorks from './Pages/info/HowItWorks'
import Contact from './Pages/info/Contact'
import AdminMessages from './Pages/admin/AdminMessages'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/donate-food" element={<DonateFood />} />
        <Route path="/incoming-requests" element={<IncomingRequests />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin/users/:id" element={<AdminUserDetails />} />
        <Route path="/receiver-dashboard" element={<ReceiverDashboard />} />
        <Route path="/available-food" element={<AvailableFood />} />
        <Route path="/receive-food" element={<ReceiveFood />} />
        <Route path="/request-status" element={<RequestStatus />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
      </Routes>
    </Router>
  )
}

export default App
