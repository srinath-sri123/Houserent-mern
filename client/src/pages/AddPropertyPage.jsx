import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Image,
  Video,
  CheckCircle,
  PlusCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const COMMON_AMENITIES = [
  'Air Conditioning',
  'Swimming Pool',
  'Gym & Fitness',
  'Covered Parking',
  'Pet Friendly',
  'In-unit Washer/Dryer',
  'Balcony / Terrace',
  '24/7 Security',
  'Elevator',
  'High-speed Fiber WiFi',
  'Rooftop Lounge',
  'Dishwasher',
];

const SAMPLE_IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
];

const AddPropertyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    securityDeposit: '',
    address: '',
    city: 'New York',
    state: 'NY',
    zipCode: '',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    furnishedStatus: 'Furnished',
    amenities: ['Air Conditioning', 'High-speed Fiber WiFi', 'In-unit Washer/Dryer'],
    imagesText: SAMPLE_IMAGE_PRESETS.join('\n'),
    virtualTourUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const imagesArray = formData.imagesText
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        securityDeposit: Number(formData.securityDeposit) || Number(formData.price),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        propertyType: formData.propertyType,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
        furnishedStatus: formData.furnishedStatus,
        amenities: formData.amenities,
        images: imagesArray.length > 0 ? imagesArray : SAMPLE_IMAGE_PRESETS,
        virtualTourUrl: formData.virtualTourUrl || undefined,
      };

      const res = await propertyService.createProperty(payload);
      alert('Property listed successfully! It is now submitted for verification.');
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/landlord/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to submit property listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="card" style={{ padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Post a New Rental Listing</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Publish your property with high-definition visuals, virtual tours, and detailed amenities.
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', color: '#fb7185', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Listing Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Modern Skyline Luxury 2BHK Apartment"
                className="input-field"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Pricing & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Monthly Rent ($ USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="3200"
                  className="input-field"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Security Deposit ($ USD)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  placeholder="3200"
                  className="input-field"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  className="input-field"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  className="input-field"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="New York"
                  className="input-field"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="NY"
                  className="input-field"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Zip Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  placeholder="10001"
                  className="input-field"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Specifications */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  min="0"
                  className="input-field"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  min="1"
                  step="0.5"
                  className="input-field"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Area (Sq. Ft.)
                </label>
                <input
                  type="number"
                  name="areaSqFt"
                  min="100"
                  className="input-field"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Furnished Status
                </label>
                <select
                  name="furnishedStatus"
                  className="input-field"
                  value={formData.furnishedStatus}
                  onChange={handleChange}
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Detailed Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe the architectural highlights, neighborhood, natural lighting, and transit proximity..."
                className="input-field"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Amenities Checkbox Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Amenities & Features
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                {COMMON_AMENITIES.map((amenity) => {
                  const selected = formData.amenities.includes(amenity);
                  return (
                    <button
                      type="button"
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        border: selected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                        background: selected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: selected ? '#60a5fa' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <CheckCircle size={15} color={selected ? '#60a5fa' : '#64748b'} />
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image URLs */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Photo URLs (1 per line)
              </label>
              <textarea
                name="imagesText"
                rows={3}
                placeholder="https://images.unsplash.com/photo-..."
                className="input-field"
                value={formData.imagesText}
                onChange={handleChange}
              />
            </div>

            {/* Virtual Tour URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                360° Virtual Tour Panorama URL (optional)
              </label>
              <input
                type="url"
                name="virtualTourUrl"
                placeholder="https://..."
                className="input-field"
                value={formData.virtualTourUrl}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? 'Submitting Property...' : '🚀 Submit Listing for Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;
