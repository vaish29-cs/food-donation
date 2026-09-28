import { useState } from 'react'
import { Link } from 'react-router-dom'
import './MainPage.css'
import SiteHeader from '../../Components/SiteHeader'
import SiteFooter from '../../Components/SiteFooter'

function MainPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
      title: 'Feeding Communities',
      description: 'Every meal donated makes a difference in someone\'s life'
    },
    {
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      title: 'Supporting NGOs',
      description: 'Partnering with organizations to maximize impact'
    },
    {
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
      title: 'Helping Orphanages',
      description: 'Bringing nutrition and hope to children in need'
    },
    {
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
      title: 'Reducing Food Waste',
      description: 'Transforming surplus into sustenance'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="main-page">
      <SiteHeader />

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Share Food, Save Lives</h1>
          <p className="hero-subtitle"> Join us in delivering food to people and families who need it most. Every meal counts.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-large btn-primary">Start Donating</Link>
            <Link to="/how-it-works" className="btn btn-large btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <h2 className="section-title">Our Impact in Action</h2>
        <div className="carousel">
          <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
          <div className="carousel-track">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <img src={slide.image} alt={slide.title} className="carousel-image" />
                <div className="carousel-caption">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn next" onClick={nextSlide}>›</button>
        </div>
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Donate With Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Easy Donation Process</h3>
            <p>Simple platform to list and donate food items with just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Wide Network</h3>
            <p>Connect with NGOs, orphanages, and communities across the region</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Verified Recipients</h3>
            <p>All recipient organizations are verified to ensure your donation reaches those in need</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Your Impact</h3>
            <p>See the real difference your donations make in the community</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your account as a donor or recipient</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>List or Browse</h3>
            <p>Donors list food items, recipients browse available donations</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect</h3>
            <p>Match with recipients and arrange pickup or delivery</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Make Impact</h3>
            <p>See your donation help those in need</p>
          </div>
        </div>
      </section>

      {/* For Receivers Section */}
      <section className="for-receivers">
        <h2 className="section-title">For Receivers</h2>
        <div className="receivers-content">
          <div className="receivers-info">
            <h3>How to Receive Food</h3>
            <div className="receiver-steps">
              <div className="receiver-step">
                <div className="step-icon">📋</div>
                <div className="step-text">
                  <h4>Browse Available Donations</h4>
                  <p>View food listings from donors in your area with details about type, quantity, and pickup location</p>
                </div>
              </div>
              <div className="receiver-step">
                <div className="step-icon">🔍</div>
                <div className="step-text">
                  <h4>Filter & Search</h4>
                  <p>Find specific food items that match your needs using our smart search and filter options</p>
                </div>
              </div>
              <div className="receiver-step">
                <div className="step-icon">📞</div>
                <div className="step-text">
                  <h4>Request & Connect</h4>
                  <p>Send requests to donors and coordinate pickup or delivery arrangements directly</p>
                </div>
              </div>
              <div className="receiver-step">
                <div className="step-icon">🚚</div>
                <div className="step-text">
                  <h4>Receive Food</h4>
                  <p>Collect your requested food items and help reduce waste while feeding those in need</p>
                </div>
              </div>
            </div>
          </div>
          <div className="receivers-cta">
            <h3>Ready to Receive?</h3>
            <p>Join our network of NGOs, orphanages, and communities to access food donations</p>
            <Link to="/register" className="btn btn-large btn-receiver">Register as Receiver</Link>
            <p className="receivers-note">* All recipient organizations are verified for safety and authenticity</p>
          </div>
        </div>
      </section>

     
      <section className="stats">
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Meals Donated</div>
          </div>
          <div className="stat">
            <div className="stat-number">200+</div>
            <div className="stat-label">Partner NGOs</div>
          </div>
          <div className="stat">
            <div className="stat-number">15K+</div>
            <div className="stat-label">Active Donors</div>
          </div>
          <div className="stat">
            <div className="stat-number">100+</div>
            <div className="stat-label">Cities Covered</div>
          </div>
        </div>
      </section>

     
      <section className="cta">
        <h2>Ready to Make a Difference?</h2>
        <p>Join thousands of donors helping to fight hunger and reduce food waste</p>
        <Link to="/register" className="btn btn-large btn-primary">Get Started Today</Link>
      </section>

      <SiteFooter />
    </div>
  )
}

export default MainPage
