import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchFilterBar from '../components/SearchFilterBar';
import VirtualTourModal from '../components/VirtualTourModal';
import {
  Home,
  ShieldCheck,
  Compass,
  Sparkles,
  CalendarCheck,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
  Key,
} from 'lucide-react';

const CITIES_SHOWCASE = [
  {
    name: 'New York',
    state: 'NY',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    count: '1,420+ Listings',
  },
  {
    name: 'Los Angeles',
    state: 'CA',
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&q=80',
    count: '980+ Listings',
  },
  {
    name: 'Miami',
    state: 'FL',
    image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=600&q=80',
    count: '750+ Listings',
  },
  {
    name: 'San Francisco',
    state: 'CA',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
    count: '640+ Listings',
  },
  {
    name: 'Austin',
    state: 'TX',
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=600&q=80',
    count: '520+ Listings',
  },
  {
    name: 'Seattle',
    state: 'WA',
    image: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=600&q=80',
    count: '430+ Listings',
  },
];

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTourProperty, setSelectedTourProperty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await propertyService.getFeaturedProperties();
        setFeaturedProperties(res.data.data);
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchTrigger = () => {
    navigate('/properties');
  };

  return (
    <div>
      {/* 360 Tour Modal */}
      {selectedTourProperty && (
        <VirtualTourModal
          property={selectedTourProperty}
          onClose={() => setSelectedTourProperty(null)}
        />
      )}

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 7rem',
          overflow: 'hidden',
        }}
      >
        {/* Background glow discs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            {/* Top Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: '30px',
                color: '#60a5fa',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} />
              Next-Gen Real Estate & House Rental Platform
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: '800',
                letterSpacing: '-1.5px',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
              }}
            >
              Discover Your Dream Home With{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Zero Compromise
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              Browse verified luxury apartments, modern villas, and urban lofts with 360° virtual tours, transparent pricing, and instant lease scheduling.
            </p>
          </div>

          {/* Search Filter Bar */}
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            <SearchFilterBar onSearch={handleSearchTrigger} />
          </div>

          {/* Quick Stat Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              maxWidth: '900px',
              margin: '3.5rem auto 0',
              textAlign: 'center',
            }}
          >
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>5,200+</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Verified Properties</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>98.4%</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Renter Satisfaction</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>360°</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Immersive Virtual Tours</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>24/7</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Concierge Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by City Section */}
      <section className="section" style={{ background: 'rgba(17, 24, 39, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Prime Destinations
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.25rem' }}>
                Explore by Popular Metro Cities
              </h2>
            </div>
            <Link to="/properties" className="btn btn-secondary btn-sm">
              View All Locations <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CITIES_SHOWCASE.map((city, idx) => (
              <Link
                key={idx}
                to={`/properties?city=${encodeURIComponent(city.name)}`}
                className="glass-panel"
                style={{
                  position: 'relative',
                  height: '220px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.3) 60%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                    {city.name}, {city.state}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>
                    {city.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Handpicked Residencies
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.25rem' }}>
                Featured Rental Properties
              </h2>
            </div>
            <Link to="/properties" className="btn btn-primary btn-sm">
              Explore All Listings <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
              Loading curated properties...
            </div>
          ) : (
            <div className="grid-auto-fit">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onOpenTour={(p) => setSelectedTourProperty(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 360 Virtual Tour Spotlight Banner */}
      <section className="section" style={{ padding: '0 0 5rem' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 3rem',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                  }}
                >
                  <Compass size={16} /> REVOLUTIONARY VIEWING EXPERIENCE
                </div>
                <h2 style={{ fontSize: '2.4rem', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                  Tour Homes in High-Definition 360° Without Leaving Your Couch
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Experience every detail of your future home. Navigate from the sunlit living lounge to the rooftop pool with interactive room teleportation and spatial immersion.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.92rem' }}>
                    <CheckCircle2 size={18} color="#34d399" />
                    <span>Real-time photo-realistic panoramas of all rooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.92rem' }}>
                    <CheckCircle2 size={18} color="#34d399" />
                    <span>Instant tour visit booking with property owners</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.92rem' }}>
                    <CheckCircle2 size={18} color="#34d399" />
                    <span>Accurate architectural floorplan dimensions and specs</span>
                  </div>
                </div>

                <Link to="/properties" className="btn btn-primary btn-lg">
                  <Compass size={18} />
                  Start Exploring Tours
                </Link>
              </div>

              <div
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="360 Tour Preview"
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'rgba(59, 130, 246, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
                    }}
                  >
                    <Compass size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose HouseHunt */}
      <section className="section" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Built For All Real Estate Stakeholders
            </div>
            <h2 style={{ fontSize: '2.4rem', color: '#fff', marginTop: '0.25rem' }}>
              Why People Love HouseHunt
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.75rem' }}>
              Streamlined processes from initial discovery to digital lease signing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.6rem' }}>
                Admin Verified Listings
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every single property submitted by landlords goes through a strict moderation queue before being published. No fake listings or bait-and-switch.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <CalendarCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.6rem' }}>
                1-Click Tour Scheduling
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Pick your preferred time slot and schedule in-person tours or apply directly for 12-month leases with clear upfront deposit breakdowns.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Building size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.6rem' }}>
                Landlord Growth Suite
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Property owners get rich analytics, tenant request management, lease approvals, and revenue metrics in their dedicated owner portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Join Platform */}
      <section className="section">
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '24px',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem' }}>
              Ready to Discover Your Next Home?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Join thousands of happy tenants and landlords on HouseHunt. Browse verified properties today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/properties" className="btn btn-primary btn-lg">
                Explore All Properties
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
