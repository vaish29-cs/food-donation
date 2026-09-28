import { useEffect, useState } from 'react'
import { getDonationRequests } from '../../services/api'
import ReceiverLayout from './ReceiverLayout'

export default function RequestStatus() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getDonationRequests('receiver').then((data) => setRequests(data || [])).catch(() => setError('Unable to load request status.'))
  }, [])

  return (
    <ReceiverLayout title="Check status" subtitle="Follow every request from sent to accepted.">
      {error && <div className="receiver-alert">{error}</div>}
      {requests.length === 0 && !error ? <div className="receiver-empty"><h2>No requests yet</h2><p>When you request food, its status will appear here.</p></div> : (
        <div className="status-list">
          {requests.map((request) => <article className="status-card" key={request.id}><div><h2>{request.foodName || 'Food donation'}</h2><p>Donor: {request.donorName}</p><p>Requested: {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'Recently'}</p><p>Quantity: {request.requiredQuantity || request.foodQuantity || '—'}</p><p>Purpose: {request.purpose || '—'}</p></div><span className={`status-pill status-${String(request.status || 'Pending').toLowerCase()}`}>{request.status || 'Pending'}</span></article>)}
        </div>
      )}
    </ReceiverLayout>
  )
}
