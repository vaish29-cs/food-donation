import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAvailableFood, getDonationRequests } from '../../services/api'
import ReceiverLayout from './ReceiverLayout'

export default function ReceiverDashboard() {
  const [requests, setRequests] = useState([])
  const [availableFood, setAvailableFood] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getDonationRequests('receiver'), getAvailableFood()])
      .then(([requestData, foodData]) => {
        setRequests(requestData || [])
        setAvailableFood((foodData || []).filter((donation) => donation.availabilityStatus !== 'Removed'))
      })
      .catch(() => setError('Unable to load your receiver summary. Please try again.'))
  }, [])

  const completedCount = requests.filter((request) => request.status === 'Accepted').length
  const pendingCount = requests.filter((request) => request.status === 'Pending').length
  const recentReceived = requests.filter((request) => request.status === 'Accepted').slice(0, 5)

  return (
    <ReceiverLayout
      title="Receiver dashboard"
      subtitle="Keep track of food received and discover new donations from the community."
    >
      {error && <div className="receiver-alert">{error}</div>}
      <section className="receiver-welcome">
        <div>
          <p className="receiver-eyebrow">Your impact</p>
          <h2>{completedCount} {completedCount === 1 ? 'food request' : 'food requests'} received</h2>
          <p>Accepted requests are counted as completed food received.</p>
        </div>
        <Link className="receiver-primary-button" to="/available-food">Browse food</Link>
      </section>

      <section className="receiver-stat-grid">
        <div className="receiver-stat-card"><span>Total Food Received</span><strong>{completedCount}</strong><small>Successful requests</small></div>
        <div className="receiver-stat-card"><span>Pending Requests</span><strong>{pendingCount}</strong><small>Awaiting donor response</small></div>
        <div className="receiver-stat-card"><span>Available Food</span><strong>{availableFood.length}</strong><small>Current donations</small></div>
        <div className="receiver-stat-card"><span>Completed Requests</span><strong>{completedCount}</strong><small>Delivered food</small></div>
      </section>

      <section className="recent-received-section">
        <div className="receiver-section-heading"><div><p className="receiver-eyebrow">Your history</p><h2>Recent Food Received</h2></div><Link to="/request-status">Check status</Link></div>
        {recentReceived.length === 0 ? <div className="receiver-empty"><p>No completed food requests yet.</p></div> : (
          <div className="recent-received-table-wrap">
            <table className="recent-received-table">
              <thead><tr><th>Food Item</th><th>Donor</th><th>Quantity</th><th>Received Date</th><th>Status</th></tr></thead>
              <tbody>{recentReceived.map((request) => <tr key={request.id}><td>{request.foodName || 'Food donation'}</td><td>{request.donorName}</td><td>{request.requiredQuantity || request.foodQuantity || '—'}</td><td>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : '—'}</td><td><span className="status-pill status-accepted">Delivered</span></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>

      <section className="receiver-shortcuts">
        <div><span className="receiver-card-icon">01</span><h3>See available food</h3><p>Browse the latest donations and find something useful for your organization.</p><Link to="/available-food">Open listings</Link></div>
        <div><span className="receiver-card-icon">02</span><h3>Receive food</h3><p>Choose a donation, send a message, and coordinate the pickup details.</p><Link to="/receive-food">Make a request</Link></div>
        <div><span className="receiver-card-icon">03</span><h3>Check status</h3><p>Review pending, accepted, and rejected requests in one place.</p><Link to="/request-status">View status</Link></div>
      </section>
    </ReceiverLayout>
  )
}
