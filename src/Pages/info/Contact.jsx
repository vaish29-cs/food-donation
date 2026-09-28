import { Link } from 'react-router-dom'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'
import { sendContactMessage } from '../../services/api'
import { useState } from 'react'
import './InfoPages.css'

export default function Contact() {
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    try {
      await sendContactMessage({ name: form.name.value.trim(), email: form.email.value.trim(), message: form.message.value.trim() })
      form.reset()
      setError('')
      setFeedback('Your message was sent. Our team will get back to you soon.')
    } catch (requestError) {
      setFeedback('')
      setError(requestError.message || 'Could not send your message.')
    }
  }

  return (
    <div className="info-page">
      <SiteHeader />
      <main>
        <section className="info-hero info-hero-compact">
          <span className="info-kicker">Contact FoodShare</span>
          <h1>Let us help move good food where it is needed.</h1>
          <p>Reach the FoodShare team for platform support, partnership questions, or help coordinating a donation.</p>
        </section>
        <section className="contact-layout">
          <div className="contact-details contact-panel">
            <span className="info-kicker">Contact details</span>
            <h2>We are here to help.</h2>
            <p className="contact-intro">Whether you are donating surplus food or coordinating a pickup, our team can help you find the next step.</p>
            <div className="contact-detail"><span className="contact-icon" aria-hidden="true">📧</span><div><strong>Email</strong><a href="mailto:info@foodshare.org">info@foodshare.org</a></div></div>
            <div className="contact-detail"><span className="contact-icon" aria-hidden="true">📞</span><div><strong>Phone</strong><a href="tel:+919876543210">+91 98765 43210</a></div></div>
            <div className="contact-detail"><span className="contact-icon" aria-hidden="true">📍</span><div><strong>Office and pickup support</strong><p>B-Wing, 5th Cross, Rajaji Nagar</p></div></div>
            <div className="contact-detail"><span className="contact-icon" aria-hidden="true">🕒</span><div><strong>Support hours</strong><p>Monday - Saturday, 9:00 AM - 6:00 PM</p></div></div>
            <div className="contact-response"><strong>Typical response time</strong><span>Within one business day</span></div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <span className="info-kicker">Message us</span><h2>Tell us how we can help.</h2><p className="contact-form-intro">We will send your message to the FoodShare support team.</p>
            {feedback && <div className="contact-success">{feedback}</div>}
            {error && <div className="contact-error">{error}</div>}
            <label>Name<input name="name" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Message<textarea name="message" rows="6" placeholder="How can we help?" required /></label>
            <button className="info-primary-button" type="submit">Send message</button>
          </form>
        </section>
        <section className="info-callout"><h2>Want to get started now?</h2><p>Join FoodShare as a donor or receiver and begin making an impact.</p><Link className="info-primary-button" to="/register">Create an account</Link></section>
      </main>
      <SiteFooter />
    </div>
  )
}
