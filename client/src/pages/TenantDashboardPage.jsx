import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { bookingService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import {
  Calendar,
  Clock,
  Heart,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Home,
  FileText,
  Mail,
  Phone,
} from 'lucide-react';

const TenantDashboardPage = () => {
  const { user } = useAuth();
  const { favorites } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'bookings';

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await bookingService.getMyBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking/request?')) return;
    try {
      await bookingService.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-approved"><CheckCircle size={13} style={{ marginRight: '4px' }} /> Confirmed</span>;
      case 'pending':
        return <span className="badge badge-pending"><Clock size={13} style={{ marginRight: '4px' }} /> Pending Approval</span>;
      case 'cancelled':
        return <span className="badge badge-rejected"><XCircle size={13} style={{ marginRight: '4px' }} /> Cancelled</span>;
      case 'completed':
        return <span className="badge badge-type"><CheckCircle size={13} style={{ marginRight: '4px' }} /> Completed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>Welcome back, {user?.name}!</h1>
                <span className="badge badge-type">Tenant Portal</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Manage your scheduled property viewings, lease applications, and saved homes.
              </p>
            </div>
          </div>

          <Link to="/properties" className="btn btn-primary">
            <Home size={18} /> Browse Properties
          </Link>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '2rem' }}>
          <button
            onClick={() => setSearchParams({ tab: 'bookings' })}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'bookings' ? '#60a5fa' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Calendar size={18} /> My Bookings & Visits ({bookings.length})
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'favorites' })}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'favorites' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'favorites' ? '#60a5fa' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Heart size={18} /> Saved Homes ({favorites.length})
          </button>
        </div>

        {/* TAB 1: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {loadingBookings ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No bookings or visit requests yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Explore verified listings and schedule on-site viewings or apply for leases online.
                </p>
                <Link to="/properties" className="btn btn-primary">
                  Explore Listings
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      padding: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <img
                        src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                        alt={booking.property?.title}
                        style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)' }}>
                            {booking.bookingType === 'visit' ? '🗓️ Schedule In-Person Tour' : '📄 Rental Lease Application'}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <Link
                          to={`/properties/${booking.property?._id}`}
                          style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}
                        >
                          {booking.property?.title || 'Property listing'}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                          <span>
                            <strong>Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'} {booking.timeSlot ? `at ${booking.timeSlot}` : ''}
                          </span>
                          <span>
                            <strong>Landlord:</strong> {booking.landlord?.name || 'Assigned Agent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Link to={`/properties/${booking.property?._id}`} className="btn btn-secondary btn-sm">
                        View Property
                      </Link>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No saved properties yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Click the heart icon on any property card to save homes and compare them here.
                </p>
                <Link to="/properties" className="btn btn-primary">
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.75rem',
                }}
              >
                {favorites.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboardPage;
