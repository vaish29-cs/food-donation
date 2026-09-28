import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getContactMessages } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import SiteFooter from '../../Components/SiteFooter'
import SiteHeader from '../../Components/SiteHeader'
import '../MainPage/MainPage.css'
import './Admin.css'

export default function AdminMessages() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (getCurrentUser()?.userType !== 'admin') {
      navigate('/login')
      return
    }
    getContactMessages().then((data) => setMessages(data || [])).catch((requestError) => setError(requestError.message || 'Could not load messages'))
  }, [navigate])

  return (
    <div className="admin-page">
      <SiteHeader actions={<Link to="/admin" className="btn btn-outline">Admin Dashboard</Link>} />
      <main className="admin-container admin-messages-page">
        <Link className="admin-back-link" to="/admin">← Back to users</Link>
        <div className="admin-messages-heading"><div><span className="admin-section-kicker">Admin inbox</span><h1>Contact Messages</h1><p>Messages submitted through the FoodShare contact page.</p></div><div className="admin-inbox-summary"><strong>{messages.filter((message) => message.status === 'Unread').length}</strong><span>unread</span></div></div>
        {error && <div className="admin-error">{error}</div>}
        {!error && messages.length === 0 ? <div className="admin-detail-panel admin-empty-message"><h2>No messages yet</h2><p>New contact messages will appear here.</p></div> : <div className="admin-message-list">{messages.map((message) => <article className={`admin-message-card ${message.status === 'Unread' ? 'admin-message-unread' : ''}`} key={message.id}><div className="admin-message-card-top"><div><span className="admin-message-avatar">{message.name.slice(0, 1).toUpperCase()}</span><div><h2>{message.name}</h2><a href={`mailto:${message.email}`}>{message.email}</a></div></div><div className="admin-message-meta"><span className={`admin-message-status ${message.status === 'Unread' ? 'admin-message-status-unread' : ''}`}>{message.status}</span><time>{new Date(message.createdAt).toLocaleString()}</time></div></div><p className="admin-message-body">{message.message}</p><a className="admin-reply-link" href={`mailto:${message.email}?subject=FoodShare%20Support`}>Reply by email</a></article>)}</div>}
      </main>
      <SiteFooter />
    </div>
  )
}
