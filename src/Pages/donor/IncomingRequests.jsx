import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDonationRequests, updateRequestStatus } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import './Donor.css'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'

export default function IncomingRequests() {
  const [requests, setRequests] = useState([])
  const [user] = useState(() => getCurrentUser())
  const [notification, setNotification] = useState('')
  const notificationShown = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser?.email) {
      navigate('/login')
      return
    }
    if (currentUser.userType !== 'donor' && currentUser.userType !== 'both') {
      navigate('/login')
      return
    }

    getDonationRequests('donor')
      .then((incomingRequests) => {
        const resolvedRequests = incomingRequests || []
        setRequests(resolvedRequests)
        if (resolvedRequests.length > 0) {
          setNotification(`${resolvedRequests.length} incoming request${resolvedRequests.length === 1 ? '' : 's'} from receiver${resolvedRequests.length === 1 ? '' : 's'}.`)
        } else {
          setNotification('No incoming requests yet. When a receiver sends a request, it will appear here.')
        }
      })
      .catch(() => {
        setRequests([])
        setNotification('Unable to load incoming requests. Please try again.')
      })
  }, [navigate])

  useEffect(() => {
    if (!user || requests.length === 0 || notificationShown.current) {
      return
    }

    if ('Notification' in window) {
      const showNotification = () => {
        new Notification('FoodShare: New incoming requests', {
          body: `${requests.length} new request${requests.length === 1 ? '' : 's'} waiting for you.`,
          icon: '/favicon.svg'
        })
      }

      if (Notification.permission === 'granted') {
        showNotification()
        notificationShown.current = true
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            showNotification()
          }
          notificationShown.current = true
        })
      }
    }
  }, [requests, user])

  const requestCount = requests.length

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status)
      setRequests((currentRequests) => currentRequests.map((request) => (
        request.id === requestId ? { ...request, status } : request
      )))
    } catch (error) {
      setNotification(error.message || 'Unable to update request status.')
    }
  }

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
            <h1>Incoming Requests</h1>
            <p className="dashboard-subtitle">Requests sent by receivers for your donations.</p>
            <div className={`notification-banner ${requestCount > 0 ? 'notification-new' : 'notification-empty'}`}>
              {notification}
            </div>
          </div>

          {!user ? (
            <div className="empty-state">
              <h2>Login required</h2>
              <p>You must be logged in as a donor to view incoming requests.</p>
              <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
          ) : (
            <>
              <div className="stats-card-row">
                <div className="stats-card">
                  <h3>Total Requests</h3>
                  <p>{requestCount}</p>
                </div>
                <div className="stats-card">
                  <h3>Unread Requests</h3>
                  <p>{requestCount}</p>
                </div>
              </div>

              {requestCount === 0 ? (
                <div className="empty-state">
                  <h2>No requests yet</h2>
                  <p>Waiting for receivers to send requests for your donations.</p>
                  <p>Share your donation listings and ask them to request items from your profile.</p>
                </div>
              ) : (
                <div className="requests-list">
                  {requests.map((request) => (
                    <div key={request.id ?? `${request.receiverEmail}-${request.foodName}`} className="request-card">
                      <div className="request-card-header">
                        <h3>{request.receiverName || request.receiverEmail}</h3>
                        <span className="request-status">{request.status || 'Pending'}</span>
                      </div>
                      <div className="request-card-body">
                        <p><strong>Food:</strong> {request.foodName || '—'}</p>
                        <p><strong>Quantity:</strong> {request.foodQuantity || '—'}</p>
                        <p><strong>Receiver Email:</strong> {request.receiverEmail}</p>
                        <p><strong>Message:</strong> {request.message || 'No additional message'}</p>
                        <p><strong>Requested on:</strong> {request.requestDate || 'Unknown'}</p>
                        <p><strong>Pickup:</strong> {request.pickupLocation || 'Follow up with receiver'}</p>
                        {request.status === 'Pending' && (
                          <div className="request-actions">
                            <button type="button" className="request-action request-action-accept" onClick={() => handleStatusUpdate(request.id, 'Accepted')}>Accept</button>
                            <button type="button" className="request-action request-action-reject" onClick={() => handleStatusUpdate(request.id, 'Rejected')}>Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
