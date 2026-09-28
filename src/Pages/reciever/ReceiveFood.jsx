import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createFoodRequest, getAvailableFood } from '../../services/api'
import { getCurrentUser } from '../../utils/auth'
import ReceiverLayout from './ReceiverLayout'

function donationLabel(donation) {
  let items = donation.foodItems
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items)
    } catch {
      items = []
    }
  }
  const names = Array.isArray(items) && items.length > 0 ? items.map((item) => item.name).join(', ') : donation.foodName
  const quantities = Array.isArray(items) && items.length > 0 ? items.map((item) => item.quantity).join(', ') : donation.foodQuantity
  return `${names} - ${quantities} from ${donation.donorName}`
}

function donationItems(donation) {
  let items = donation.foodItems
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items)
    } catch {
      items = []
    }
  }
  return Array.isArray(items) && items.length > 0
    ? items
    : [{ name: donation.foodName, category: donation.foodCategory || 'Other', quantity: donation.foodQuantity }]
}

export default function ReceiveFood() {
  const user = getCurrentUser()
  const [searchParams] = useSearchParams()
  const [donations, setDonations] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [message, setMessage] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [requiredQuantity, setRequiredQuantity] = useState('')
  const [numberOfPeople, setNumberOfPeople] = useState('')
  const [purpose, setPurpose] = useState('')
  const [preferredPickupDate, setPreferredPickupDate] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAvailableFood().then((data) => {
      setDonations((data || []).filter((donation) => donation.availabilityStatus !== 'Removed'))
      const linkedDonationId = searchParams.get('donationId')
      setSelectedIds(linkedDonationId ? [linkedDonationId] : [])
    }).catch(() => setError('Unable to load available food.'))
  }, [searchParams])

  const submitRequest = async (event) => {
    event.preventDefault()
    const selectedDonations = donations.filter((donation) => selectedIds.includes(String(donation.id)))
    if (selectedDonations.length === 0) {
      setError('Select at least one food item before submitting your request.')
      return
    }
    try {
      await Promise.all(selectedDonations.map((donation) => createFoodRequest({
        donationId: donation.id,
        donorEmail: donation.donorEmail,
        donorName: donation.donorName,
        receiverEmail: user.email,
        receiverName: user.name,
        foodName: donationItems(donation).map((item) => item.name).join(', '),
        foodQuantity: donationItems(donation).map((item) => item.quantity).join(', '),
        requiredQuantity,
        numberOfPeople,
        purpose,
        preferredPickupDate,
        message,
        pickupLocation
      })))
      setFeedback(`${selectedDonations.length} food request${selectedDonations.length === 1 ? '' : 's'} sent to the donor${selectedDonations.length === 1 ? '' : 's'}. Check Status for updates.`)
      setSelectedIds([])
      setMessage('')
      setPickupLocation('')
      setRequiredQuantity('')
      setNumberOfPeople('')
      setPurpose('')
      setPreferredPickupDate('')
    } catch (requestError) {
      setError(requestError.message || 'Could not send request.')
    }
  }

  return (
    <ReceiverLayout title="Receive food" subtitle="Send a clear request to a donor and coordinate the next step.">
      {error && <div className="receiver-alert">{error}</div>}
      {feedback && <div className="receiver-success">{feedback}</div>}
      {donations.length === 0 ? <div className="receiver-empty"><h2>No donations to request</h2><p>Check back soon for new food listings.</p></div> : (
        <form className="receiver-form" onSubmit={submitRequest}>
          <fieldset className="receiver-food-selection">
            <legend>Food Item<span aria-hidden="true">*</span></legend>
            <p>Select one or more available donations.</p>
            <div className="receiver-food-options">
              {donations.map((donation) => {
                const donationId = String(donation.id)
                const selected = selectedIds.includes(donationId)
                return (
                  <label className={`receiver-food-option ${selected ? 'receiver-food-option-selected' : ''}`} key={donation.id}>
                    <input type="checkbox" checked={selected} onChange={() => setSelectedIds((currentIds) => selected ? currentIds.filter((id) => id !== donationId) : [...currentIds, donationId])} />
                    <span className="receiver-food-option-content"><strong>{donationLabel(donation)}</strong><small>{donation.address}</small></span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <label><span>Required Quantity<span className="required-mark">*</span></span><input value={requiredQuantity} onChange={(event) => setRequiredQuantity(event.target.value)} placeholder="e.g. 5 kg" required /></label>
          <label><span>Number of People<span className="required-mark">*</span></span><input type="number" min="1" value={numberOfPeople} onChange={(event) => setNumberOfPeople(event.target.value)} placeholder="e.g. 10" required /></label>
          <label><span>Purpose<span className="required-mark">*</span></span><input value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="e.g. Community meal" required /></label>
          <label><span>Preferred Pickup Date<span className="required-mark">*</span></span><input type="date" value={preferredPickupDate} onChange={(event) => setPreferredPickupDate(event.target.value)} required /></label>
          <label><span>Pickup Location<span className="required-mark">*</span></span><input value={pickupLocation} onChange={(event) => setPickupLocation(event.target.value)} placeholder="e.g. Sangli" required /></label>
          <label>Additional Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows="5" placeholder="Add any details for the donor." /></label>
          <button className="receiver-primary-button" type="submit">Submit Request</button>
        </form>
      )}
    </ReceiverLayout>
  )
}
