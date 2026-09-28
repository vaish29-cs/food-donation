import { Link } from 'react-router-dom'
import './SiteChrome.css'

export default function SiteHeader({ actions }) {
  return (
    <header className="header site-header">
      <div className="header-container">
        <Link to="/" className="logo site-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">FoodShare</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/how-it-works" className="nav-link">How It Works</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <div className="auth-buttons">
          {actions || <Link to="/login" className="btn btn-outline">Login</Link>}
        </div>
      </div>
    </header>
  )
}
