import React from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Star,
  Eye,
  Camera,
  ShieldCheck,
} from 'lucide-react';

const PropertyCard = ({ property, onOpenTour }) => {
  const { toggleFavorite, isFavorite } = useProperties();
  const favorite = isFavorite(property._id);

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className="glass-panel"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Image Container with Badges */}
      <div
        style={{
          position: 'relative',
          height: '240px',
          overflow: 'hidden',
          backgroundColor: '#1e293b',
        }}
      >
        <img
          src={mainImage}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(11, 15, 25, 0.9) 0%, rgba(11, 15, 25, 0.2) 50%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <span className="badge badge-type">{property.propertyType}</span>
          {property.featured && (
            <span className="badge badge-featured">★ Featured</span>
          )}
          {property.status === 'pending' && (
            <span className="badge badge-pending">Pending Review</span>
          )}
        </div>

        {/* Favorite & Tour Buttons */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          {onOpenTour && (
            <button
              onClick={() => onOpenTour(property)}
              title="View 360° Virtual Tour"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0284c7')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)')
              }
            >
              <Camera size={16} />
            </button>
          )}

          <button
            onClick={() => toggleFavorite(property)}
            title="Save to Favorites"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: favorite ? '#f43f5e' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <Heart size={16} fill={favorite ? '#f43f5e' : 'none'} />
          </button>
        </div>

        {/* Price on image bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.35rem',
          }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              color: '#ffffff',
            }}
          >
            ${property.rentPrice?.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>/ month</span>
        </div>

        {/* Rating on image bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fbbf24',
          }}
        >
          <Star size={13} fill="#fbbf24" />
          <span>{property.rating ? property.rating.toFixed(1) : '5.0'}</span>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            ({property.numReviews || 0})
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            color: '#94a3b8',
            marginBottom: '0.4rem',
          }}
        >
          <MapPin size={14} color="#3b82f6" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.address}, {property.city}, {property.state}
          </span>
        </div>

        <Link to={`/properties/${property._id}`}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: '700',
              color: '#f8fafc',
              marginBottom: '0.75rem',
              lineHeight: 1.35,
              transition: 'var(--transition)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#f8fafc')}
          >
            {property.title}
          </h3>
        </Link>

        {/* Specs Grid */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: '#cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bed size={16} color="#94a3b8" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bath size={16} color="#94a3b8" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Maximize2 size={15} color="#94a3b8" />
            <span>{property.areaSqFt?.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link
            to={`/properties/${property._id}`}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.88rem', padding: '0.6rem 1rem' }}
          >
            <Eye size={15} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
