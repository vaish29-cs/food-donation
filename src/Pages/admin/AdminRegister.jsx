import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerAdmin } from '../../services/api'
import { setAuth } from '../../utils/auth'
import '../auth/Register.css'
import '../MainPage/MainPage.css'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'

export default function AdminRegister() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    try {
      const response = await registerAdmin({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        password: form.password.value
      })
      setAuth(response.user, response.token)
      navigate('/admin')
    } catch (requestError) {
      setError(requestError.message || 'Could not create admin account')
    }
  }

  return (
    <div className="register-page">
      <SiteHeader />
      <main className="register-main">
        <div className="register-container">
          <div className="register-header"><h1>Create Admin Account</h1><p>Use your email with the shared administrator password.</p></div>
          {error && <div className="admin-error">{error}</div>}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="name">Full Name</label><input id="name" name="name" required /></div>
            <div className="form-group"><label htmlFor="phone">Phone Number</label><input id="phone" name="phone" required /></div>
            <div className="form-group"><label htmlFor="email">Admin Email</label><input type="email" id="email" name="email" required /></div>
            <div className="form-group"><label htmlFor="password">Admin Password</label><input type="password" id="password" name="password" required /></div>
            <button className="btn btn-primary btn-full" type="submit">Create Admin Account</button>
          </form>
          <div className="register-footer"><p><Link to="/login">Back to login</Link></p></div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
