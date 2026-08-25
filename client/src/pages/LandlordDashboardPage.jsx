import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService, bookingService } from '../services/api';
import {
  Building,
  PlusCircle,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Users,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

const LandlordDashboardPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propRes, bookRes] = await Promise.all([
        propertyService.getMyProperties(),
        bookingService.getLandlordBookings(),
      ]);
      setProperties(propRes.data.data || []);
      setBookings(bookRes.data.data || []);
    } catch (err) {
      console.error('Failed to load landlord data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await propertyService.deleteProperty(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, { status });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update request status');
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

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
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #10b981' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>Landlord Command Center</h1>
                <span className="badge badge-approved">Host Portal</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Welcome back, {user?.name}. Manage listings, approve tenant visits, and oversee lease inquiries.
              </p>
            </div>
          </div>

          <Link to="/properties/new" className="btn btn-primary">
            <PlusCircle size={18} /> Post New Listing
          </Link>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <Building size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{properties.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total Properties</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingBookings.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Pending Requests</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {properties.filter((p) => p.status === 'approved').length}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Live Listings</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{bookings.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total Interactions</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('properties')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'properties' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'properties' ? '#60a5fa' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Building size={18} /> My Listings ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
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
            <Calendar size={18} /> Tenant Inquiries & Visits ({bookings.length})
            {pendingBookings.length > 0 && (
              <span className="badge badge-pending" style={{ marginLeft: '4px', fontSize: '0.7rem' }}>
                {pendingBookings.length} new
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: Properties */}
        {activeTab === 'properties' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading listings...</div>
            ) : properties.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Building size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No listings published yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  List your apartment, villa, or modern studio to start getting inquiries from verified tenants.
                </p>
                <Link to="/properties/new" className="btn btn-primary">
                  <PlusCircle size={18} /> Post Your First Listing
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {properties.map((prop) => (
                  <div
                    key={prop._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <img
                        src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                        alt={prop.title}
                        style={{ width: '110px', height: '85px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <span
                            className={`badge ${
                              prop.status === 'approved'
                                ? 'badge-approved'
                                : prop.status === 'pending'
                                ? 'badge-pending'
                                : 'badge-rejected'
                            }`}
                          >
                            {prop.status === 'approved' ? 'Active' : prop.status === 'pending' ? 'Pending Admin Review' : 'Rejected'}
                          </span>
                          <span className="badge badge-type">{prop.propertyType}</span>
                        </div>
                        <Link to={`/properties/${prop._id}`} style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                          {prop.title}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                          <span>
                            <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {prop.city}, {prop.state}
                          </span>
                          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                            ${prop.price?.toLocaleString()} / mo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Link to={`/properties/${prop._id}`} className="btn btn-secondary btn-sm">
                        <Eye size={15} /> View
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(prop._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading inquiries...</div>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No tenant inquiries received yet</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  When tenants request a tour visit or submit an application, you can review and accept them here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-type">
                          {booking.bookingType === 'visit' ? '🗓️ Schedule Tour Visit' : '📄 Rental Lease Application'}
                        </span>
                        <span
                          className={`badge ${
                            booking.status === 'confirmed'
                              ? 'badge-approved'
                              : booking.status === 'pending'
                              ? 'badge-pending'
                              : 'badge-rejected'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                        Property: <Link to={`/properties/${booking.property?._id}`} style={{ color: '#60a5fa' }}>{booking.property?.title}</Link>
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div><strong>Applicant:</strong> {booking.tenant?.name} ({booking.tenant?.email})</div>
                        <div><strong>Requested Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'} {booking.timeSlot || ''}</div>
                        {booking.message && <div><strong>Note:</strong> "{booking.message}"</div>}
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle size={15} /> Accept Request
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                          className="btn btn-danger btn-sm"
                        >
                          <XCircle size={15} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboardPage;
