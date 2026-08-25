import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('househunt_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        localStorage.removeItem('househunt_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('househunt_user', JSON.stringify(userData));
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return userData;
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const res = await authService.register(formData);
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('househunt_user', JSON.stringify(userData));
      showToast(`Account created! Welcome to HouseHunt, ${userData.name}!`, 'success');
      return userData;
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('househunt_user');
    showToast('Logged out successfully', 'info');
  };

  const quickDemoLogin = async (role) => {
    const roleCredentials = {
      tenant: { email: 'tenant@househunt.com', password: 'password123' },
      landlord: { email: 'landlord@househunt.com', password: 'password123' },
      admin: { email: 'admin@househunt.com', password: 'password123' },
    };

    const creds = roleCredentials[role];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem('househunt_user', JSON.stringify(updatedUser));
      showToast('Profile updated successfully!', 'success');
      return updatedUser;
    } catch (error) {
      showToast(error.message || 'Profile update failed', 'error');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateProfile,
        showToast,
        toast,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLandlord: user?.role === 'landlord',
        isTenant: user?.role === 'tenant',
      }}
    >
      {children}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'info' && 'ℹ️'}
              {toast.type === 'warning' && '⚠️'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
