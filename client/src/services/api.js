import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls (Attach JWT token)
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('househunt_user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Authentication Endpoints
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getDemoUsers: () => api.get('/auth/demo-users'),
};

// Properties Endpoints
export const propertyService = {
  getProperties: (params) => api.get('/properties', { params }),
  getFeaturedProperties: () => api.get('/properties/featured'),
  getCities: () => api.get('/properties/cities'),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getMyProperties: () => api.get('/properties/my-properties'),
  approveProperty: (id) => api.put(`/properties/${id}/approve`),
  rejectProperty: (id, reason) => api.put(`/properties/${id}/reject`, { reason }),
};

// Bookings Endpoints
export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getLandlordBookings: () => api.get('/bookings/landlord-requests'),
  updateBookingStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

// Reviews Endpoints
export const reviewService = {
  getPropertyReviews: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  createReview: (data) => api.post('/reviews', data),
};

// Admin Endpoints
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllProperties: (params) => api.get('/admin/properties', { params }),
  getAllBookings: () => api.get('/admin/bookings'),
};

// Seed endpoint
export const seedDatabase = () => api.post('/seed');

export default api;
