import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getCurrentUser } from '../../utils/auth'
import './Receiver.css'
import '../MainPage/MainPage.css'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'

export default function ReceiverLayout({ children, title, subtitle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const user = getCurrentUser()

  if (!user?.email || (user.userType !== 'recipient' && user.userType !== 'both')) {
    navigate('/login')
    return null
  }

  const links = [
    { to: '/receiver-dashboard', label: 'Dashboard' },
    { to: '/available-food', label: 'See Available Food' },
    { to: '/receive-food', label: 'Receive Food' },
    { to: '/request-status', label: 'Check Status' }
  ]

  return (
    <div className="receiver-page">
      <SiteHeader actions={<button type="button" className="receiver-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open receiver menu"><span /><span /><span /></button>} />

      {menuOpen && <div className="receiver-menu-backdrop" onClick={() => setMenuOpen(false)} />}
      <aside className={`receiver-menu ${menuOpen ? 'receiver-menu-open' : ''}`}>
        <div className="receiver-menu-top">
          <strong>Receiver menu</strong>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close receiver menu">x</button>
        </div>
        <nav>
          {links.map((link) => (
            <Link key={link.to} className={location.pathname === link.to ? 'receiver-menu-active' : ''} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
        </nav>
        <Link className="receiver-menu-logout" to="/" onClick={() => setMenuOpen(false)}>Logout</Link>
      </aside>

      <main className="receiver-main">
        <div className="receiver-heading">
          <div>
            <p className="receiver-eyebrow">Receiver workspace</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="receiver-user-chip">{user.name || user.email}</div>
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
