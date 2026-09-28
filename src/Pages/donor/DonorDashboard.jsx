import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDonationRequests, getMyDonations } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import '../MainPage/MainPage.css'
import './Donor.css'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'

function DonorDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = getCurrentUser()
    if (!storedUser?.email || (storedUser.userType !== 'donor' && storedUser.userType !== 'both')) {
      navigate('/login')
      return
    }
    Promise.all([getMyDonations(), getDonationRequests('donor')])
      .then(([donationData, requestData]) => {
        setDonations(donationData || [])
        setRequests(requestData || [])
      })
      .catch(() => setError('Unable to load your donation summary.'))
  }, [navigate])

  const pendingRequests = requests.filter((request) => request.status === 'Pending').length
  const completedDonations = requests.filter((request) => request.status === 'Accepted').length
  const availableFood = donations.filter((donation) => new Date(donation.expiryTime) > new Date()).length

  return (
    <div className="dashboard-page">
      <SiteHeader actions={<><Link to="/" className="btn btn-outline">Logout</Link><button type="button" className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button></>} />

      <div className={`dashboard-panel ${menuOpen ? 'open' : ''}`}>
        <button type="button" className="panel-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        <ul className="panel-links">
          <li><Link to="/donor-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link to="/donate-food" onClick={() => setMenuOpen(false)}>Donate Food</Link></li>
          <li><Link to="/incoming-requests" onClick={() => setMenuOpen(false)}>Incoming Requests</Link></li>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Logout</Link></li>
        </ul>
      </div>
      {menuOpen && <div className="panel-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-top">
            <h1>Donor Dashboard</h1>
          </div>
          {error && <div className="notification-banner notification-empty">{error}</div>}

          <div className="dashboard-cards">
            <div className="stats-card">
              <h3>Total Donations</h3>
              <p>{donations.length}</p>
            </div>
            <div className="stats-card">
              <h3>Available Food</h3>
              <p>{availableFood} items</p>
            </div>
            <div className="stats-card">
              <h3>Pending Requests</h3>
              <p>{pendingRequests}</p>
            </div>
            <div className="stats-card">
              <h3>Completed Donations</h3>
              <p>{completedDonations}</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default DonorDashboard
