import { useEffect, useState } from 'react'
import '../MainPage/MainPage.css'
import './Donor.css'
import SiteHeader from '../../Components/SiteHeader'
import { Link, useNavigate } from 'react-router-dom'
import { createDonation } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'

function DonateFood() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user] = useState(() => getCurrentUser() || { name: '', email: '', phone: '' })
  const [minimumExpiryTime] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))
  const [foodItems, setFoodItems] = useState([{ name: '', category: '', quantity: '' }])
  const [formValues, setFormValues] = useState({
    address: '',
    expiryTime: '',
    description: '',
    image: null
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser?.email) {
      navigate('/login')
      return
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value, files } = event.target
    if (name === 'image') {
      setFormValues((prev) => ({ ...prev, image: files[0] || null }))
      return
    }
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFoodItemChange = (index, field, value) => {
    setFoodItems((items) => items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )))
  }

  const addFoodItem = () => {
    setFoodItems((items) => [...items, { name: '', category: '', quantity: '' }])
  }

  const removeFoodItem = (index) => {
    setFoodItems((items) => items.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { address, expiryTime } = formValues
    const hasIncompleteItem = foodItems.some((item) => !item.name || !item.category || !item.quantity)
    if (!address || hasIncompleteItem || !expiryTime) {
      alert('Please complete all required fields.')
      return
    }
    const expiryDate = new Date(expiryTime)
    if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      alert('Please choose an expiry date and time that has not passed.')
      return
    }

    try {
      await createDonation({
        donorName: user.name,
        donorEmail: user.email,
        donorPhone: user.phone,
        address,
        foodItems,
        expiryTime,
        description: formValues.description,
        image: formValues.image ? formValues.image.name : ''
      })
      alert('Donation submitted successfully.')
      setFormValues({
        address: '',
        expiryTime: '',
        description: '',
        image: null
      })
      setFoodItems([{ name: '', category: '', quantity: '' }])
    } catch (error) {
      alert(error.message || 'Could not submit donation.')
    }
  }

  return (
    <div className="dashboard-page">
      <SiteHeader actions={<><Link to="/" className="btn btn-outline">Logout</Link><button type="button" className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button></>} />

      <div className={`dashboard-panel ${menuOpen ? 'open' : ''}`}>
        <button type="button" className="panel-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        <ul className="panel-links">
          <li><Link to="/donor-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link to="/donate-food" onClick={() => setMenuOpen(false)}>Donate Food</Link></li>
          <li><Link to="/incoming-requests" onClick={() => setMenuOpen(false)}>Incoming Requests</Link></li>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Logout</Link></li>
        </ul>
      </div>
      {menuOpen && <div className="panel-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="donor-main">
        <section className="donor-content">
          <div className="donor-top">
            <h1>Donate Food</h1>
            <p>Provide food details below so your donation can reach those in need.</p>
          </div>

          <form className="donate-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="donorName">Name</label>
                <input id="donorName" value={user.name} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="donorEmail">Email</label>
                <input id="donorEmail" value={user.email} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="donorPhone">Phone</label>
                <input id="donorPhone" value={user.phone} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address*</label>
                <input id="address" name="address" value={formValues.address} onChange={handleChange} placeholder="Pickup address or location" required />
              </div>
              <div className="form-group form-full">
                <div className="food-items-heading">
                  <div>
                    <label>Food Items*</label>
                    <p>Add each food separately so receivers can understand the donation.</p>
                  </div>
                </div>
                <div className="food-items-list">
                  {foodItems.map((item, index) => (
                    <div className="food-item-row" key={index}>
                      <div className="food-item-title">
                        <strong>Food item {index + 1}</strong>
                        {foodItems.length > 1 && <button type="button" className="remove-food-button" onClick={() => removeFoodItem(index)} aria-label={`Remove food item ${index + 1}`}>Remove</button>}
                      </div>
                      <div className="food-item-fields">
                        <label>
                          Food name
                          <input value={item.name} onChange={(event) => handleFoodItemChange(index, 'name', event.target.value)} placeholder="e.g. Rice" required />
                        </label>
                        <label>
                          Category
                          <select value={item.category} onChange={(event) => handleFoodItemChange(index, 'category', event.target.value)} required>
                            <option value="">Select category</option>
                            <option value="Grains">Grains</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Prepared Meals">Prepared Meals</option>
                            <option value="Other">Other</option>
                          </select>
                        </label>
                        <label>
                          Quantity
                          <input value={item.quantity} onChange={(event) => handleFoodItemChange(index, 'quantity', event.target.value)} placeholder="e.g. 5 kg" required />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-outline add-food-button" onClick={addFoodItem}>Add another food</button>
              </div>
              <div className="form-group">
                <label htmlFor="expiryTime">Expiry Time*</label>
                <input id="expiryTime" name="expiryTime" type="datetime-local" min={minimumExpiryTime} value={formValues.expiryTime} onChange={handleChange} required />
              </div>
              <div className="form-group form-full">
                <label htmlFor="description">Description (optional)</label>
                <textarea id="description" name="description" value={formValues.description} onChange={handleChange} rows="4" placeholder="Any notes for pickup or food condition" />
              </div>
              <div className="form-group form-full">
                <label htmlFor="image">Upload Image (optional)</label>
                <input id="image" name="image" type="file" accept="image/*" onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full">Submit Donation</button>
          </form>
        </section>
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

export default DonateFood
