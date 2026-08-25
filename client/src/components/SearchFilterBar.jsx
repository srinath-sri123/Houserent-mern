import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { propertyService } from '../services/api';
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const PROPERTY_TYPES = [
  'All',
  'Apartment',
  'House',
  'Villa',
  'Studio',
  'Condo',
  'Townhouse',
];

const BEDROOM_OPTIONS = ['All', '1', '2', '3', '4+'];

const SearchFilterBar = ({ onSearch, isCompact = false }) => {
  const { filters, updateFilter, resetFilters } = useProperties();
  const [cities, setCities] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await propertyService.getCities();
        setCities(['All', ...res.data.data]);
      } catch (err) {
        setCities(['All', 'New York', 'Los Angeles', 'San Francisco', 'Miami', 'Austin', 'Seattle', 'Chicago', 'Boston']);
      }
    };
    fetchCities();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  if (isCompact) {
    return (
      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          padding: '0.75rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            placeholder="Search city, neighborhood, or keyword..."
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="glass-input"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === 'All' ? 'All Cities' : city}
            </option>
          ))}
        </select>

        <select
          value={filters.propertyType}
          onChange={(e) => updateFilter('propertyType', e.target.value)}
          className="glass-input"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Types' : type}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          <Search size={16} />
          Search
        </button>
      </form>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        position: 'relative',
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Main 4-Column Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Location / Keyword */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#94a3b8',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <Search size={14} color="#3b82f6" />
              Keywords & Title
            </label>
            <input
              type="text"
              placeholder="e.g. Modern, Penthouse, Pool"
              value={filters.keyword}
              onChange={(e) => updateFilter('keyword', e.target.value)}
              className="glass-input"
            />
          </div>

          {/* City Selector */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#94a3b8',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <MapPin size={14} color="#3b82f6" />
              Metro City
            </label>
            <select
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="glass-input"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Locations' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#94a3b8',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <Home size={14} color="#3b82f6" />
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className="glass-input"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Property Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#94a3b8',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => updateFilter('bedrooms', e.target.value)}
              className="glass-input"
            >
              {BEDROOM_OPTIONS.map((bed) => (
                <option key={bed} value={bed}>
                  {bed === 'All' ? 'Any Bedrooms' : `${bed} Bedrooms`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvanced && (
          <div
            style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            {/* Price Range */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
                Min Rent ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
                Max Rent ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 7000"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="glass-input"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="glass-input"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="area_desc">Largest Area (Sq Ft)</option>
              </select>
            </div>
          </div>
        )}

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn btn-secondary btn-sm"
            >
              <SlidersHorizontal size={15} />
              {showAdvanced ? 'Hide Advanced Filters' : 'More Filters (Price & Sort)'}
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-secondary btn-sm"
              style={{ color: '#94a3b8' }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '160px' }}>
            <Search size={18} />
            Find Houses
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilterBar;
