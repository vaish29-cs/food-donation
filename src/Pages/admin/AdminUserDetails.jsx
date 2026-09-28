import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserDetails } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import '../MainPage/MainPage.css'
import './Admin.css'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'

export default function AdminUserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (getCurrentUser()?.userType !== 'admin') {
      navigate('/login')
      return
    }
    getUserDetails(id).then(setDetails).catch((requestError) => setError(requestError.message || 'Could not load user details'))
  }, [id, navigate])

  if (error) return <div className="admin-page"><main className="admin-container"><p className="admin-error">{error}</p><Link className="admin-link-button" to="/admin">Back to users</Link></main></div>
  if (!details) return <div className="admin-page"><main className="admin-container"><p>Loading user details...</p></main></div>

  const { user, donations, received, sent } = details
  const roleLabel = user.userType === 'both' ? 'Donor + Receiver' : user.userType === 'recipient' ? 'Receiver' : user.userType
  const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const acceptedRequests = [...received, ...sent].filter((request) => request.status === 'Accepted').length

  return (
    <div className="admin-page">
      <SiteHeader actions={<Link to="/admin" className="btn btn-outline">Admin Dashboard</Link>} />
      <main className="admin-container">
        <Link className="admin-back-link" to="/admin">← Back to users</Link>
        <section className="admin-profile-hero"><div className="admin-avatar">{initials}</div><div className="admin-profile-copy"><div className="admin-profile-title"><h1>{user.name}</h1><span className="admin-role-tag">{roleLabel}</span></div><p>{user.email} <span>•</span> {user.phone}</p><small>Member since {new Date(user.createdAt).toLocaleDateString()}</small></div></section>
        <section className="admin-detail-stats"><div><span>Donations</span><strong>{donations.length}</strong></div><div><span>Food received</span><strong>{received.length}</strong></div><div><span>Completed requests</span><strong>{acceptedRequests}</strong></div></section>
        <div className="admin-detail-grid admin-detail-page-grid">
          <section className="admin-detail-panel"><div className="admin-section-title"><div><span className="admin-section-kicker">Donor activity</span><h2>Donated Food</h2></div><span className="admin-count-badge">{donations.length}</span></div>{donations.length === 0 ? <p className="admin-empty-detail">No donations recorded.</p> : <div className="admin-record-list">{donations.map((donation) => <article className="admin-record" key={donation.id}><div><strong>{donation.foodName}</strong><span>{donation.foodQuantity} · {donation.address}</span></div><small>{new Date(donation.createdAt).toLocaleString()}</small></article>)}</div>}</section>
          <section className="admin-detail-panel"><div className="admin-section-title"><div><span className="admin-section-kicker">Receiver activity</span><h2>Food Received</h2></div><span className="admin-count-badge">{received.length}</span></div>{received.length === 0 ? <p className="admin-empty-detail">No received requests.</p> : <div className="admin-record-list">{received.map((request) => <article className="admin-record" key={request.id}><div><strong>{request.foodName}</strong><span>From {request.donorName} · {request.pickupLocation || 'Pickup not set'}</span></div><div><span className={`status-pill status-${String(request.status || 'Pending').toLowerCase()}`}>{request.status || 'Pending'}</span><small>{new Date(request.requestDate).toLocaleString()}</small></div></article>)}</div>}</section>
          <section className="admin-detail-panel"><div className="admin-section-title"><div><span className="admin-section-kicker">Requests received</span><h2>Donor Requests</h2></div><span className="admin-count-badge">{sent.length}</span></div>{sent.length === 0 ? <p className="admin-empty-detail">No incoming requests.</p> : <div className="admin-record-list">{sent.map((request) => <article className="admin-record" key={request.id}><div><strong>{request.foodName}</strong><span>For {request.receiverName} · {request.pickupLocation || 'Pickup not set'}</span></div><div><span className={`status-pill status-${String(request.status || 'Pending').toLowerCase()}`}>{request.status || 'Pending'}</span><small>{new Date(request.requestDate).toLocaleString()}</small></div></article>)}</div>}</section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
