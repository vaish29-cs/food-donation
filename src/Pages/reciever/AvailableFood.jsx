import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAvailableFood } from '../../services/api'
import ReceiverLayout from './ReceiverLayout'

function getFoodItems(donation) {
  if (Array.isArray(donation.foodItems) && donation.foodItems.length > 0) return donation.foodItems
  if (typeof donation.foodItems === 'string') {
    try {
      const parsedItems = JSON.parse(donation.foodItems)
      if (Array.isArray(parsedItems) && parsedItems.length > 0) return parsedItems
    } catch {
      return [{ name: donation.foodName, category: donation.foodCategory || 'Other', quantity: donation.foodQuantity }]
    }
  }
  return [{ name: donation.foodName, category: donation.foodCategory || 'Other', quantity: donation.foodQuantity }]
}

export default function AvailableFood() {
  const [donations, setDonations] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAvailableFood().then((data) => setDonations(data || [])).catch(() => setError('Unable to load available food.'))
  }, [])

  return (
    <ReceiverLayout title="See available food" subtitle="Explore recent donations and choose what your organization needs.">
      {error && <div className="receiver-alert">{error}</div>}
      {donations.length === 0 && !error ? <div className="receiver-empty"><h2>No food listings yet</h2><p>New donations will appear here when donors share food.</p></div> : (
        <div className="receiver-list-grid">
          {donations.map((donation) => (
            <article className="food-listing-card" key={donation.id}>
              <div className="food-listing-top"><span className={`food-listing-tag ${donation.availabilityStatus === 'Removed' ? 'food-listing-removed' : ''}`}>{donation.availabilityStatus || 'Available'}</span><span>{getFoodItems(donation).length} food items</span></div>
              <h2>{getFoodItems(donation).map((item) => item.name).join(', ')}</h2>
              <div className="food-listing-items">{getFoodItems(donation).map((item, index) => <span key={`${item.name}-${index}`}>{item.name} | {item.category} | {item.quantity}</span>)}</div>
              <p>{donation.description || 'Fresh food donation available for pickup.'}</p>
              <div className="food-listing-details"><span>From {donation.donorName}</span><span>{donation.address}</span></div>
              {donation.availabilityStatus === 'Removed' ? <span className="food-removed-note">Request accepted. This food is being removed.</span> : <Link className="receiver-secondary-button" to={`/receive-food?donationId=${donation.id}`}>Request Food</Link>}
            </article>
          ))}
        </div>
      )}
    </ReceiverLayout>
  )
}
