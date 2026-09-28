import { Link } from 'react-router-dom'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'
import './InfoPages.css'

export default function About() {
  return (
    <div className="info-page">
      <SiteHeader />
      <main>
        <section className="info-hero">
          <span className="info-kicker">About FoodShare</span>
          <h1>Good food should reach people, not landfills.</h1>
          <p>FoodShare connects donors with verified receivers so surplus meals and ingredients can move quickly to communities that need them.</p>
        </section>
        <section className="info-content info-story">
          <div><span className="info-kicker">Our purpose</span><h2>A simpler way to share what matters.</h2></div>
          <div><p>Donors can publish clear food details, quantities, pickup information, and expiry times in one place. Receivers can browse current donations, request exactly what they need, and follow each request until it is accepted or rejected.</p><p>Every action is connected to the platform database, keeping donor listings, receiver requests, and admin oversight synchronized.</p></div>
        </section>
        <section className="info-content">
          <span className="info-kicker">Built for every participant</span>
          <div className="info-card-grid">
            <article className="info-card"><span className="info-card-mark">01</span><h3>Donors</h3><p>List one or more food items with categories, quantities, pickup details, and a future expiry time.</p><Link to="/register">Start donating</Link></article>
            <article className="info-card"><span className="info-card-mark">02</span><h3>Receivers</h3><p>Browse available food, select donations, submit a detailed request, and monitor its status.</p><Link to="/register">Join as a receiver</Link></article>
            <article className="info-card"><span className="info-card-mark">03</span><h3>Admins</h3><p>Review users, role tags, donated food, received requests, and account activity from one control area.</p><Link to="/admin-register">Admin access</Link></article>
          </div>
        </section>
        <section className="info-callout"><h2>Small actions create a reliable food network.</h2><p>Share food, request responsibly, and keep every handoff visible.</p><Link className="info-primary-button" to="/how-it-works">See how it works</Link></section>
      </main>
      <SiteFooter />
    </div>
  )
}
