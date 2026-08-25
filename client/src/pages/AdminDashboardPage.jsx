import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, propertyService, seedDatabase } from '../services/api';
import {
  ShieldCheck,
  Users,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  DollarSign,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [seeding, setSeeding] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, propsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllProperties(),
        adminService.getUsers(),
      ]);
      setStats(statsRes.data.data);
      setProperties(propsRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await propertyService.approveProperty(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to approve property');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection reason for landlord:', 'Missing required verification details');
    if (!reason) return;
    try {
      await propertyService.rejectProperty(id, reason);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to reject property');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Delete this property permanently from the platform?')) return;
    try {
      await propertyService.deleteProperty(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await adminService.deleteUser(userId);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Re-seed database with fresh initial mock data?')) return;
    setSeeding(true);
    try {
      await seedDatabase();
      alert('Database re-seeded successfully!');
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to re-seed database');
    } finally {
      setSeeding(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Admin Header */}
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
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)',
              }}
            >
              <ShieldCheck size={32} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>Platform Administration</h1>
                <span className="badge badge-rejected">Super Admin</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Full system control: listing approvals, user moderation, analytics, and demo state resets.
              </p>
            </div>
          </div>

          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
          >
            <RefreshCw size={17} className={seeding ? 'spin' : ''} />
            {seeding ? 'Resetting Data...' : 'Reset & Re-Seed Demo Data'}
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Users</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats?.totalUsers || users.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem' }}>
              {stats?.tenants || 0} Tenants | {stats?.landlords || 0} Landlords
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Listings</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats?.totalProperties || properties.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>
              {properties.filter((p) => p.status === 'approved').length} Active Live
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ fontSize: '0.82rem', color: '#fbbf24', marginBottom: '0.25rem', fontWeight: 600 }}>Needs Review</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
              {properties.filter((p) => p.status === 'pending').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Pending Listings</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Bookings</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats?.totalBookings || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '0.25rem' }}>Visits & Leases</div>
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
            <Building size={18} /> Manage Listings ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'users' ? '#60a5fa' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Users size={18} /> Platform Users ({users.length})
          </button>
        </div>

        {/* TAB 1: Properties Moderation */}
        {activeTab === 'properties' && (
          <div>
            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {['all', 'pending', 'approved', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st} ({st === 'all' ? properties.length : properties.filter((p) => p.status === st).length})
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No properties match this filter status.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredProperties.map((prop) => (
                  <div
                    key={prop._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <img
                        src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'}
                        alt={prop.title}
                        style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span
                            className={`badge ${
                              prop.status === 'approved'
                                ? 'badge-approved'
                                : prop.status === 'pending'
                                ? 'badge-pending'
                                : 'badge-rejected'
                            }`}
                          >
                            {prop.status}
                          </span>
                          <span className="badge badge-type">{prop.propertyType}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Host: {prop.landlord?.name || 'Landlord'}
                          </span>
                        </div>
                        <Link to={`/properties/${prop._id}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                          {prop.title}
                        </Link>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {prop.city}, {prop.state} • ${prop.price?.toLocaleString()} / mo
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {prop.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(prop._id)}
                          className="btn btn-primary btn-sm"
                          style={{ background: '#10b981', borderColor: '#10b981' }}
                        >
                          <CheckCircle size={15} /> Approve
                        </button>
                      )}
                      {prop.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(prop._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                        >
                          <XCircle size={15} /> Reject
                        </button>
                      )}
                      <Link to={`/properties/${prop._id}`} className="btn btn-secondary btn-sm">
                        <Eye size={15} /> View
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(prop._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Users Management */}
        {activeTab === 'users' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading user accounts...</div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                      <th style={{ padding: '1rem' }}>Joined Date</th>
                      <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={u.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              background: '#1e293b',
                              color: '#fff',
                              border: '1px solid rgba(255,255,255,0.1)',
                              fontSize: '0.82rem',
                            }}
                          >
                            <option value="tenant">tenant</option>
                            <option value="landlord">landlord</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
