import { Link } from 'react-router-dom'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'
import './InfoPages.css'

const donorSteps = [
  ['01', 'Create an account', 'Register as a donor or choose both if you also receive food.'],
  ['02', 'Add a donation', 'Enter multiple food names, categories, quantities, pickup address, and expiry time.'],
  ['03', 'Wait for requests', 'Receivers can discover your current donation and send a detailed request.'],
  ['04', 'Accept or reject', 'Review the request, then accept or reject it from Incoming Requests.'],
  ['05', 'Complete the handoff', 'Accepted food is marked for removal and disappears after its short transition period.']
]

const receiverSteps = [
  ['01', 'Browse available food', 'See current donor listings with food, quantity, location, and expiry information.'],
  ['02', 'Select donations', 'Choose one or several available donations. You can select or deselect items before submitting.'],
  ['03', 'Complete the request', 'Provide required quantity, people served, purpose, pickup date, pickup location, and an optional message.'],
  ['04', 'Track the decision', 'Check Status shows whether each request is pending, accepted, or rejected.'],
  ['05', 'Receive the food', 'When a donor accepts, the request appears in your received history with its details.']
]

export default function HowItWorks() {
  return (
    <div className="info-page">
      <SiteHeader />
      <main>
        <section className="info-hero info-hero-compact">
          <span className="info-kicker">How FoodShare works</span>
          <h1>One clear path from surplus food to a shared meal.</h1>
          <p>Every role has a focused workflow, and each step is recorded so people know what is available, requested, and completed.</p>
        </section>
        <section className="process-section">
          <div className="process-heading"><span className="info-kicker">For donors</span><h2>Share food with confidence.</h2><p>Publish accurate details, respond to requests, and keep your listings current.</p></div>
          <div className="process-list">{donorSteps.map(([number, title, text]) => <article className="process-step" key={number}><span className="process-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>
        <section className="process-section process-receiver">
          <div className="process-heading"><span className="info-kicker">For receivers</span><h2>Request only what you need.</h2><p>Choose current donations and give donors the information needed to coordinate pickup.</p></div>
          <div className="process-list">{receiverSteps.map(([number, title, text]) => <article className="process-step" key={number}><span className="process-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>
        <section className="info-content workflow-options"><span className="info-kicker">Platform options</span><div className="info-card-grid"><article className="info-card"><h3>Multiple food items</h3><p>A single donation can include several food names, categories, and quantities.</p></article><article className="info-card"><h3>Live availability</h3><p>Expired or accepted donations stop appearing as requestable food.</p></article><article className="info-card"><h3>Admin visibility</h3><p>Administrators can inspect account roles, donated food, received food, locations, and timestamps.</p></article></div></section>
        <section className="info-callout"><h2>Ready to take the next step?</h2><p>Create an account and join the FoodShare network.</p><Link className="info-primary-button" to="/register">Get started</Link></section>
      </main>
      <SiteFooter />
    </div>
  )
}
