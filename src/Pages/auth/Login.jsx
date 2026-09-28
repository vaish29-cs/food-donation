import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api'
import { setAuth } from '../../utils/auth'
import './Login.css'
import '../MainPage/MainPage.css'
import SiteHeader from '../../Components/SiteHeader'

function Login() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!selectedRole) {
      alert('Please select a role before logging in.')
      return
    }

    const form = event.target
    const email = form.email.value.trim()
    const password = form.password.value
    try {
      const response = await loginUser({ email, password, userType: selectedRole.id })
      setAuth(response.user, response.token)
      if (selectedRole.id === 'donor') {
        navigate('/donor-dashboard')
      } else if (selectedRole.id === 'recipient') {
        navigate('/receiver-dashboard')
      } else if (selectedRole.id === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      alert(error.message || 'Invalid credentials or role. Please try again.')
    }
  }

  const roles = [
    {
      id: 'donor',
      title: 'Donor',
      icon: '🎁',
      description: 'Share food with those in need',
      color: '#ffd700'
    },
    {
      id: 'recipient',
      title: 'Receiver',
      icon: '�',
      description: 'Receive food donations',
      color: '#ff6b6b'
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: '👤',
      description: 'Manage the platform',
      color: '#667eea'
    }
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleBackToRoles = () => {
    setSelectedRole(null)
  }
  return (
    <div className="login-page">
      <SiteHeader />
    
      <div className="login-content">
        {!selectedRole ? (
          <div className="role-selection">
            <div className="role-selection-header">
              <h1>Select Your Role</h1>
            </div>
            <div className="role-cards">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="role-card"
                  onClick={() => handleRoleSelect(role)}
                  style={{ "--role-color": role.color }}
                >
                  <div className="role-icon">{role.icon}</div>
                  <h3 className="role-title">{role.title}</h3>
                  <p className="role-description">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="login-container">
            <div className="login-header">
              <button onClick={handleBackToRoles} className="back-to-roles">Back to Roles</button>
              <h1>Login as {selectedRole.title}</h1>
              <p>Login to continue making a difference</p>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ backgroundColor: selectedRole.color }}>Login as {selectedRole.title}</button>
            </form>
            <div className="login-footer">
              {selectedRole.id === 'admin' ? (
                <p>Need an admin account? <Link to="/admin-register">Create admin account</Link></p>
              ) : (
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
              )}
              <p><Link to="/" className="back-link">Back to Home</Link></p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
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

export default Login
