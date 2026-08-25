import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TenantDashboardPage from './pages/TenantDashboardPage';
import LandlordDashboardPage from './pages/LandlordDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertyListingPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Landlord & Admin Route */}
                <Route
                  path="/properties/new"
                  element={
                    <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                      <AddPropertyPage />
                    </ProtectedRoute>
                  }
                />

                {/* Role-specific Dashboards */}
                <Route
                  path="/tenant/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['tenant', 'landlord', 'admin']}>
                      <TenantDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                      <LandlordDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
