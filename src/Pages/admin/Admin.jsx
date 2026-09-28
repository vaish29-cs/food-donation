import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers, removeUser, updateUserType, deleteUser } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import '../MainPage/MainPage.css'
import './Admin.css'
import SiteHeader from '../../Components/SiteHeader'

function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const current = getCurrentUser()
  const navigate = useNavigate()

  function roleTags(userType) {
    if (userType === 'both') return <><span className="admin-role-tag">donor</span><span className="admin-role-tag admin-role-receiver">receiver</span></>
    return <span className="admin-role-tag">{userType === 'recipient' ? 'receiver' : userType}</span>
  }

  async function fetchUsers() {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data || [])
    } catch (err) {
      alert(err.message || 'Could not load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  async function handleChangeType(id, newType) {
    if (!window.confirm('Change user role?')) return
    try {
      await updateUserType(id, newType)
      fetchUsers()
    } catch (err) {
      alert(err.message || 'Could not update user')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await deleteUser(id)
      setUsers((u) => u.filter((x) => x.id !== id))
    } catch (err) {
      alert(err.message || 'Could not delete user')
    }
  }

  async function handleRemove(id) {
    if (!window.confirm('Remove this user from the platform?')) return
    try {
      await removeUser(id)
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id))
    } catch (err) {
      alert(err.message || 'Could not remove user')
    }
  }

  if (!current || current.userType !== 'admin') {
    return <div className="admin-page"><p>Access denied. Admins only.</p></div>
  }

  return (
    <div className="admin-page">
      <SiteHeader actions={<Link to="/" className="btn btn-outline">Logout</Link>} />

      <main className="admin-container">
        <h1>Admin — Manage Users</h1>
        <p className="admin-subtitle">Select a user to view their donor, receiver, donation, and request history.</p>
        <Link className="admin-messages-button" to="/admin/messages">Open contact messages</Link>
      {loading ? (
        <p>Loading users…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className="admin-role-cell">
                  {roleTags(u.userType)}
                  <select defaultValue={u.userType} onChange={(e) => handleChangeType(u.id, e.target.value)}>
                    <option value="donor">donor</option>
                    <option value="recipient">recipient</option>
                    <option value="both">both</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td><button className="admin-link-button" onClick={() => navigate(`/admin/users/${u.id}`)}>View details</button></td>
                <td>
                  <div className="admin-actions"><button className="admin-remove-button" disabled={u.id === current.id} title={u.id === current.id ? 'You cannot remove your own account' : 'Remove user'} onClick={() => handleRemove(u.id)}>Remove</button><button className="admin-delete-button" disabled={u.id === current.id} title={u.id === current.id ? 'You cannot delete your own account' : 'Permanently delete user'} onClick={() => handleDelete(u.id)}>Permanent delete</button></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </main>

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
              <li><a href="/about">About Us</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Get Involved</h4>
            <ul>
              <li><a href="/register">Become a Donor</a></li>
              <li><a href="/register">Partner NGO</a></li>
              <li><a href="/volunteer">Volunteer</a></li>
              <li><a href="/donate">Donate</a></li>
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

export default Admin
