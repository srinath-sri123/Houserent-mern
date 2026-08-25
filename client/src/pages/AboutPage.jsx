import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Compass, Sparkles, Building, Users, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-type" style={{ marginBottom: '1rem' }}>
            <Sparkles size={13} style={{ marginRight: '4px' }} /> Revolutionizing Home Rentals
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Modern Real Estate, Engineered for Trust & Simplicity
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
            HouseHunt connects prospective tenants with verified landlords through immersive virtual tours, transparent pricing, and instant visit scheduling.
          </p>
        </div>

        {/* Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>100% Verified Properties</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Every listing undergoes administrative identity and title verification to prevent fraud and ensure what you see is what you get.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Compass size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>360° Virtual Tours</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Explore luxury penthouses, suburban villas, and urban apartments virtually before booking an in-person physical tour.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Seamless Lease Workflow</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Schedule appointments, apply for leases, and calculate true total cost of living with built-in financial calculators.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          className="card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Ready to find your dream space?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Browse hundreds of curated rental homes across major cities with instant booking.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/properties" className="btn btn-primary">
              Explore Properties <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join as Landlord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
