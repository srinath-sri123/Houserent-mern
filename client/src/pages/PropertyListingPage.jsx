import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/api';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import VirtualTourModal from '../components/VirtualTourModal';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  RotateCcw,
  Compass,
  MapPin,
  Home,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'];
const BEDROOMS = ['1', '2', '3', '4+'];
const FURNISHED_STATUSES = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const AMENITY_OPTIONS = [
  'High-speed WiFi',
  'Swimming Pool',
  'Gym / Fitness',
  'Covered Parking',
  'Pet Friendly',
  'Air Conditioning',
  '24/7 Security',
  'Balcony / Terrace',
  'In-unit Laundry',
  'Smart Lock',
];

const PropertyListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateFilter, resetFilters } = useProperties();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTourProperty, setSelectedTourProperty] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL search params with filters on initial load
  useEffect(() => {
    const urlCity = searchParams.get('city');
    const urlType = searchParams.get('propertyType');
    const urlKeyword = searchParams.get('keyword');

    if (urlCity) updateFilter('city', urlCity);
    if (urlType) updateFilter('propertyType', urlType);
    if (urlKeyword) updateFilter('keyword', urlKeyword);
  }, []);

  // Fetch properties whenever filters or page changes
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: filters.keyword || undefined,
        city: filters.city !== 'All' ? filters.city : undefined,
        propertyType: filters.propertyType !== 'All' ? filters.propertyType : undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        bedrooms: filters.bedrooms !== 'All' ? filters.bedrooms : undefined,
        sort: filters.sort,
        amenities: selectedAmenities.length > 0 ? selectedAmenities.join(',') : undefined,
        page: currentPage,
        limit: 9,
      };

      const res = await propertyService.getProperties(params);
      setProperties(res.data.data);
      setTotalCount(res.data.total);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, selectedAmenities, currentPage]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setSelectedAmenities([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="section" style={{ paddingTop: '2.5rem' }}>
      {/* 360 Tour Modal */}
      {selectedTourProperty && (
        <VirtualTourModal
          property={selectedTourProperty}
          onClose={() => setSelectedTourProperty(null)}
        />
      )}

      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.5rem' }}>
            Explore Verified Rental Properties
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Showing {totalCount} luxury apartments, modern houses, and lofts available for rent
          </p>
        </div>

        {/* Layout: Sidebar Filter + Results Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="listing-grid-layout"
        >
          {/* Filter Sidebar */}
          <aside
            className={`glass-panel listing-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}
            style={{
              padding: '1.5rem',
              position: 'sticky',
              top: '90px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#fff' }}>
                <Filter size={18} color="#3b82f6" />
                Filter Properties
              </div>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Search Term
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Address or title..."
                  value={filters.keyword}
                  onChange={(e) => {
                    updateFilter('keyword', e.target.value);
                    setCurrentPage(1);
                  }}
                  className="glass-input"
                  style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* City Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                City / Location
              </label>
              <select
                value={filters.city}
                onChange={(e) => {
                  updateFilter('city', e.target.value);
                  setCurrentPage(1);
                }}
                className="glass-input"
                style={{ fontSize: '0.88rem' }}
              >
                <option value="All">All Cities</option>
                <option value="New York">New York, NY</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Miami">Miami, FL</option>
                <option value="Austin">Austin, TX</option>
                <option value="Seattle">Seattle, WA</option>
                <option value="Chicago">Chicago, IL</option>
                <option value="Boston">Boston, MA</option>
              </select>
            </div>

            {/* Property Type Radio / Pills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Property Type
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['All', ...PROPERTY_TYPES].map((type) => (
                  <label
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.85rem',
                      color: filters.propertyType === type ? '#60a5fa' : '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="propertyType"
                      checked={filters.propertyType === type}
                      onChange={() => {
                        updateFilter('propertyType', type);
                        setCurrentPage(1);
                      }}
                    />
                    {type === 'All' ? 'All Types' : type}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Price Range ($ / mo)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minPrice}
                  onChange={(e) => {
                    updateFilter('minPrice', e.target.value);
                    setCurrentPage(1);
                  }}
                  className="glass-input"
                  style={{ fontSize: '0.85rem' }}
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxPrice}
                  onChange={(e) => {
                    updateFilter('maxPrice', e.target.value);
                    setCurrentPage(1);
                  }}
                  className="glass-input"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Bedrooms Pill Buttons */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Bedrooms
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem' }}>
                {['All', ...BEDROOMS].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      updateFilter('bedrooms', b);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '0.4rem 0',
                      borderRadius: '6px',
                      border: 'none',
                      background: filters.bedrooms === b ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: filters.bedrooms === b ? '#fff' : '#cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Amenities & Features
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                {AMENITY_OPTIONS.map((amenity) => (
                  <label
                    key={amenity}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.82rem',
                      color: selectedAmenities.includes(amenity) ? '#38bdf8' : '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Main Area */}
          <div>
            {/* Top Toolbar */}
            <div
              className="glass-panel"
              style={{
                padding: '0.85rem 1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Showing <span style={{ color: '#fff', fontWeight: 700 }}>{properties.length}</span> of {totalCount} listings
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sort By:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="glass-input"
                  style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="area_desc">Largest Area</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '6rem 0', color: '#94a3b8' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid rgba(59, 130, 246, 0.2)',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s infinite linear',
                    margin: '0 auto 1rem',
                  }}
                />
                Finding properties matching your criteria...
              </div>
            ) : properties.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <Search size={28} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>
                  No Properties Match Your Current Filters
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Try relaxing some of your filter criteria such as bedroom counts, price boundaries, or amenities.
                </p>
                <button onClick={handleReset} className="btn btn-primary">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid-auto-fit">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      onOpenTour={(p) => setSelectedTourProperty(p)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '3rem',
                    }}
                  >
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          border: 'none',
                          background: currentPage === pageNum ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: currentPage === pageNum ? '#fff' : '#cbd5e1',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="btn btn-secondary btn-sm"
                      style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .listing-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyListingPage;
