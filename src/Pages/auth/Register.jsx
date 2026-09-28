import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api'
import { setAuth } from '../../utils/auth'
import './Register.css'
import '../MainPage/MainPage.css'
import SiteHeader from '../../Components/SiteHeader'

function Register() {
  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()
    const form = event.target
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const phone = form.phone.value.trim()
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const userType = form.userType.value

    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    try {
      const response = await registerUser({ name, email, phone, password, userType })
      setAuth(response.user, response.token)
      if (userType === 'donor' || userType === 'both') {
        navigate('/donor-dashboard')
      } else {
        navigate('/receiver-dashboard')
      }
    } catch (error) {
      alert(error.message || 'Registration failed.')
    }
  }

  return (
    <div className="register-page">
      <SiteHeader />

      <main className="register-main">
        <div className="register-container">
          <div className="register-header">
            <h1>Join FoodShare</h1>
            <p>Create an account and start making a difference</p>
          </div>
          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Create a password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required />
            </div>
            <div className="form-group">
              <label htmlFor="userType">I want to:</label>
              <select id="userType" name="userType" required>
                <option value="">Select your role</option>
                <option value="donor">Donate Food</option>
                <option value="recipient">Receive Food (NGO/Orphanage)</option>
                <option value="both">Both Donate and Receive</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full">Create Account</button>
          </form>
          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
            <p><Link to="/" className="back-link">← Back to Home</Link></p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>FoodShare</h3>
            <p>Connecting food donors with those in need to build a hunger-free community.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Get Involved</h4>
            <ul>
              <li><Link to="/register">Become a Donor</Link></li>
              <li><Link to="/register">Partner NGO</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
              <li><Link to="/donate">Donate</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li>📧 info@foodshare.org</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 B-Wing, 5th Cross, Rajaji Nagar</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FoodShare. All rights reserved. Made with ❤️ for humanity.</p>
        </div>
      </footer>
    </div>
  )
}

export default Register
