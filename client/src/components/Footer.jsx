import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Heart, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        background: '#070a12',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '4rem 0 2rem',
        marginTop: '6rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Home size={18} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: '#fff',
                }}
              >
                House<span style={{ color: '#3b82f6' }}>Hunt</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              The modern house rental and property ecosystem. Discover verified listings, experience 360° virtual tours, and manage leases with total transparency.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#60a5fa', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> 100% Verified Landlords & Properties
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Explore Rentals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <Link to="/properties?propertyType=Apartment" style={{ transition: 'var(--transition)' }}>
                Luxury Apartments
              </Link>
              <Link to="/properties?propertyType=Villa" style={{ transition: 'var(--transition)' }}>
                Modern Villas & Estates
              </Link>
              <Link to="/properties?propertyType=Studio" style={{ transition: 'var(--transition)' }}>
                Urban Lofts & Studios
              </Link>
              <Link to="/properties?propertyType=House" style={{ transition: 'var(--transition)' }}>
                Single Family Homes
              </Link>
              <Link to="/properties?propertyType=Townhouse" style={{ transition: 'var(--transition)' }}>
                Waterfront Townhouses
              </Link>
            </div>
          </div>

          {/* Top Metro Hubs */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Top Metro Locations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <Link to="/properties?city=New York">New York, NY</Link>
              <Link to="/properties?city=Los Angeles">Los Angeles, CA</Link>
              <Link to="/properties?city=San Francisco">San Francisco, CA</Link>
              <Link to="/properties?city=Miami">Miami, FL</Link>
              <Link to="/properties?city=Austin">Austin, TX</Link>
              <Link to="/properties?city=Seattle">Seattle, WA</Link>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Contact & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="#3b82f6" />
                <span>support@househunt.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#3b82f6" />
                <span>+1 (800) 555-HUNT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="#3b82f6" />
                <span>500 Tech Vista Way, San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} HouseHunt Inc. Built for high performance real estate management.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Support Center</Link>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
