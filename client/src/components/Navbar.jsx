import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import {
  Home,
  Compass,
  Heart,
  PlusCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Building,
  KeyRound,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, quickDemoLogin, isAdmin, isLandlord } = useAuth();
  const { favorites } = useProperties();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (role) => {
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    await quickDemoLogin(role);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'landlord') navigate('/landlord/dashboard');
    else navigate('/tenant/dashboard');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isLandlord) return '/landlord/dashboard';
    return '/tenant/dashboard';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            }}
          >
            <Home size={22} color="#ffffff" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              House<span style={{ color: '#3b82f6', WebkitTextFillColor: '#3b82f6' }}>Hunt</span>
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                color: '#64748b',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '-4px',
              }}
            >
              Rental Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/properties"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.92rem',
              fontWeight: '600',
              color: isActive('/properties') ? '#60a5fa' : '#cbd5e1',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              transition: 'var(--transition)',
            }}
          >
            <Compass size={17} />
            Explore Properties
          </Link>

          <Link
            to="/about"
            style={{
              fontSize: '0.92rem',
              fontWeight: '600',
              color: isActive('/about') ? '#60a5fa' : '#94a3b8',
              padding: '0.5rem 0.75rem',
              transition: 'var(--transition)',
            }}
          >
            About
          </Link>

          <Link
            to="/contact"
            style={{
              fontSize: '0.92rem',
              fontWeight: '600',
              color: isActive('/contact') ? '#60a5fa' : '#94a3b8',
              padding: '0.5rem 0.75rem',
              transition: 'var(--transition)',
            }}
          >
            Contact
          </Link>

          {/* Quick Demo Role Switcher (Crucial for testing all 3 user roles smoothly) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setDemoDropdownOpen(!demoDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(139, 92, 246, 0.12)',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                color: '#c084fc',
              }}
            >
              <Sparkles size={15} />
              Demo Roles
            </button>

            {demoDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '240px',
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Switch Test Account
                </div>
                <button
                  onClick={() => handleDemoSwitch('tenant')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <KeyRound size={16} color="#38bdf8" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Alex (Tenant)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Book visits & apply</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('landlord')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Building size={16} color="#34d399" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Sarah (Landlord)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Post listings & leases</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <ShieldCheck size={16} color="#f43f5e" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Marcus (Admin)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Approve listings & users</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Favorites Heart */}
          <Link
            to="/tenant/dashboard?tab=favorites"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: favorites.length > 0 ? '#f43f5e' : '#94a3b8',
            }}
          >
            <Heart size={18} fill={favorites.length > 0 ? '#f43f5e' : 'none'} />
            {favorites.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#f43f5e',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Add Property Button (For Landlords / Admins) */}
          {(isLandlord || isAdmin) && (
            <Link to="/properties/new" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              List Property
            </Link>
          )}

          {/* User Section / Login buttons */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setDemoDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: '#f8fafc',
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span
                  className={`badge ${
                    user.role === 'admin'
                      ? 'badge-rejected'
                      : user.role === 'landlord'
                      ? 'badge-approved'
                      : 'badge-type'
                  }`}
                  style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}
                >
                  {user.role}
                </span>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '220px',
                    background: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.88rem',
                      color: '#cbd5e1',
                      borderRadius: '8px',
                      marginTop: '0.25rem',
                    }}
                  >
                    <LayoutDashboard size={16} />
                    My Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.88rem',
                      color: '#fb7185',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244,63,94,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1.5rem',
            background: '#0b0f19',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', fontWeight: 600 }}
          >
            Explore Properties
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#94a3b8', fontWeight: 600 }}
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#94a3b8', fontWeight: 600 }}
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="btn btn-danger"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
