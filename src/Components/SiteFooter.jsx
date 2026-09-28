import { Link } from 'react-router-dom'
import './SiteChrome.css'

export default function SiteFooter() {
  return (
    <footer className="footer site-footer">
      <div className="footer-container">
        <div className="footer-section"><h3>FoodShare</h3><p>Connecting food donors with those in need to build a hunger-free community.</p></div>
        <div className="footer-section"><h4>Quick Links</h4><ul><li><Link to="/about">About Us</Link></li><li><Link to="/how-it-works">How It Works</Link></li><li><Link to="/contact">Contact</Link></li><li><Link to="/faq">FAQ</Link></li></ul></div>
        <div className="footer-section"><h4>Get Involved</h4><ul><li><Link to="/register">Become a Donor</Link></li><li><Link to="/register">Partner NGO</Link></li><li><Link to="/volunteer">Volunteer</Link></li><li><Link to="/donate">Donate</Link></li></ul></div>
        <div className="footer-section"><h4>Contact Us</h4><ul><li>📧 info@foodshare.org</li><li>📞 +91 98765 43210</li><li>📍 B-Wing, 5th Cross, Rajaji Nagar</li></ul></div>
      </div>
      <div className="footer-bottom"><p>&copy; 2024 FoodShare. All rights reserved. Made with ❤️ for humanity.</p></div>
    </footer>
  )
}
