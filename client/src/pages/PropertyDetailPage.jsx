import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../services/api';
import { useProperties } from '../context/PropertyContext';
import VirtualTourModal from '../components/VirtualTourModal';
import BookingModal from '../components/BookingModal';
import RentCalculatorModal from '../components/RentCalculatorModal';
import ReviewSection from '../components/ReviewSection';
import PropertyCard from '../components/PropertyCard';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Share2,
  Star,
  CheckCircle2,
  Calendar,
  Compass,
  Calculator,
  ShieldCheck,
  UserCheck,
  Phone,
  Mail,
  ArrowLeft,
  DollarSign,
  Sparkles,
} from 'lucide-react';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useProperties();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modals
  const [showTourModal, setShowTourModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState([]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const res = await propertyService.getPropertyById(id);
        setProperty(res.data.data);
        setSelectedImageIndex(0);

        // Fetch related properties in the same city
        const relatedRes = await propertyService.getProperties({
          city: res.data.data.city,
          limit: 3,
        });
        setRelatedProperties(
          relatedRes.data.data.filter((p) => p._id !== res.data.data._id)
        );
      } catch (error) {
        console.error('Failed to load property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s infinite linear',
            margin: '6rem auto 1rem',
          }}
        />
        <p style={{ color: '#94a3b8' }}>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
          The requested listing may have been unlisted or removed.
        </p>
        <Link to="/properties" className="btn btn-primary">
          Back to Listings
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(property._id);
  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  ];

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      {/* Modals */}
      {showTourModal && (
        <VirtualTourModal
          property={property}
          onClose={() => setShowTourModal(false)}
        />
      )}

      {showBookingModal && (
        <BookingModal
          property={property}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {showCalculatorModal && (
        <RentCalculatorModal
          propertyPrice={property.rentPrice}
          onClose={() => setShowCalculatorModal(false)}
        />
      )}

      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <Link
            to="/properties"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Search Results
          </Link>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => toggleFavorite(property)}
              className="btn btn-secondary btn-sm"
              style={{ color: favorite ? '#f43f5e' : '#fff' }}
            >
              <Heart size={15} fill={favorite ? '#f43f5e' : 'none'} />
              {favorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Property Title & Price Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-type">{property.propertyType}</span>
              <span className="badge badge-approved">Verified Listing</span>
              {property.featured && <span className="badge badge-featured">★ Featured</span>}
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#fff', marginBottom: '0.4rem' }}>
              {property.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              <MapPin size={16} color="#3b82f6" />
              <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                ${property.rentPrice?.toLocaleString()}
              </span>
              <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ month</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Security Deposit: ${property.securityDeposit ? property.securityDeposit.toLocaleString() : property.rentPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Main Image Gallery */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              position: 'relative',
              height: '480px',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '1rem',
              backgroundColor: '#1e293b',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <img
              src={images[selectedImageIndex]}
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
            />

            {/* 360 Tour Floating Trigger Button */}
            <button
              onClick={() => setShowTourModal(true)}
              className="btn btn-primary"
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#38bdf8',
                boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
              }}
            >
              <Compass size={18} />
              Open 360° Virtual Walkthrough
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '100px',
                    height: '70px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid #3b82f6' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none',
                    opacity: selectedImageIndex === idx ? 1 : 0.6,
                    transition: 'var(--transition)',
                    flexShrink: 0,
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Details & Landlord Booking Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2.5rem',
          }}
          className="detail-grid-layout"
        >
          {/* Left Column: Description, Specs, Amenities */}
          <div>
            {/* Quick Key Specs Bar */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem 1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Bedrooms
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                  <Bed size={20} color="#3b82f6" /> {property.bedrooms} Beds
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Bathrooms
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                  <Bath size={20} color="#3b82f6" /> {property.bathrooms} Baths
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Living Area
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                  <Maximize2 size={18} color="#3b82f6" /> {property.areaSqFt?.toLocaleString()} sqft
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Furnishing
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                  {property.furnishedStatus || 'Furnished'}
                </div>
              </div>
            </div>

            {/* About this Property */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1rem' }}>
                About This Property
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.25rem' }}>
                Included Amenities & Facilities
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: '#e2e8f0',
                        fontSize: '0.92rem',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle2 size={15} />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8' }}>All standard modern utilities included.</p>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection
              propertyId={property._id}
              initialReviews={property.reviews || []}
            />
          </div>

          {/* Right Column: Landlord Card & Action Sidebar */}
          <div>
            <div
              className="glass-panel"
              style={{
                padding: '1.75rem',
                position: 'sticky',
                top: '90px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              {/* Landlord Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.5rem',
                }}
              >
                <img
                  src={
                    property.owner?.avatar ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={property.owner?.name || 'Owner'}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #3b82f6',
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>
                      {property.owner?.name || 'Verified Landlord'}
                    </h3>
                    <ShieldCheck size={16} color="#34d399" />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>
                    {property.owner?.phone || '+1 (555) 014-4422'}
                  </p>
                </div>
              </div>

              {/* Main Booking Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Calendar size={18} />
                  Schedule Tour / Apply for Lease
                </button>

                <button
                  onClick={() => setShowTourModal(true)}
                  className="btn btn-secondary"
                  style={{ width: '100%', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                >
                  <Compass size={17} />
                  Launch 360° Virtual Tour
                </button>

                <button
                  onClick={() => setShowCalculatorModal(true)}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <Calculator size={17} />
                  Affordability & Rent Calculator
                </button>
              </div>

              {/* Safety & Guarantee info */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="#38bdf8" /> HouseHunt Protection
                </div>
                Direct verified owner communication, zero hidden fees, and standard encrypted lease applications.
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedProperties.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Similar Properties in {property.city}
            </h2>
            <div className="grid-auto-fit">
              {relatedProperties.map((p) => (
                <PropertyCard
                  key={p._id}
                  property={p}
                  onOpenTour={(item) => setShowTourModal(true)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 868px) {
          .detail-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;
