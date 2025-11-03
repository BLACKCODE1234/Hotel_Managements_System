import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Set up default config for axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin endpoints
export const adminService = {
  // Get all bookings with filters
  getBookings: async (params = {}) => {
    try {
      const response = await api.get('/admin/bookings', { params });
      return {
        data: response.data.bookings || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        pageSize: response.data.pageSize || 10,
        totalPages: response.data.totalPages || 1,
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get a single booking by ID
  getBooking: async (id) => {
    try {
      const response = await api.get(`/admin/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/admin/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update a booking
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`/admin/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id} status:`, error);
      throw error;
    }
  },

  // Delete a booking
  deleteBooking: async (id) => {
    try {
      await api.delete(`/admin/bookings/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  // Get booking by ID
  getBooking: async (id) => {
    try {
      const response = await api.get(`/admin/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Get all rooms
  getRooms: async () => {
    try {
      const response = await api.get('/admin/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Update room status
  updateRoomStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/rooms/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get reports
  getReports: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get room types
  getRoomTypes: async () => {
    try {
      const response = await api.get('/admin/room-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching room types:', error);
      throw error;
    }
  },

  // Create or update room type
  saveRoomType: async (roomTypeData) => {
    try {
      const { id, ...data } = roomTypeData;
      const response = id 
        ? await api.put(`/admin/room-types/${id}`, data)
        : await api.post('/admin/room-types', data);
      return response.data;
    } catch (error) {
      console.error('Error saving room type:', error);
      throw error;
    }
  },

  // Get user activities
  getUserActivities: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },

  // Get system logs
  getSystemLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/system-logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  },

  // Get revenue statistics
  getRevenueStats: async (params = {}) => {
    try {
      const response = await api.get('/admin/stats/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  },

  // Get occupancy rates
  getOccupancyRates: async (params = {}) => {
    try {
      const response = await api.get('/admin/stats/occupancy', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy rates:', error);
      throw error;
    }
  }
};

export default adminService;
