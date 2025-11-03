import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { 
  FaHome, 
  FaBed, 
  FaUsers, 
  FaChartBar, 
  FaClipboardList, 
  FaSignOutAlt,
  FaUserCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
  FaTools
} from 'react-icons/fa';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState({
    revenue: [],
    occupancy: [],
    popularRooms: []
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeGuests: 0,
    availableRooms: 0,
    totalRooms: 0,
    totalGuests: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-01'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin and fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') {
        navigate('/admin-login');
        return;
      }

      try {
        setLoading(true);
        // Fetch all dashboard data in parallel
        const [statsData, bookingsData, roomsData, usersData, reportsData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getBookings(),
          adminService.getRooms(),
          adminService.getUsers(),
          adminService.getReports({
            startDate: dateRange.start,
            endDate: dateRange.end
          })
        ]);
        
        setStats({
          totalBookings: statsData.totalBookings || 0,
          activeGuests: statsData.activeGuests || 0,
          availableRooms: statsData.availableRooms || 0,
          totalRooms: statsData.totalRooms || 0,
          totalGuests: statsData.totalGuests || 0,
          monthlyRevenue: statsData.monthlyRevenue || 0,
          occupancyRate: statsData.occupancyRate || 0
        });
        
        setBookings(bookingsData || []);
        setRooms(roomsData || []);
        setUsers(usersData || []);
        setReports(reportsData || {
          revenue: [],
          occupancy: [],
          popularRooms: []
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, dateRange]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      // Refresh the bookings list after update
      const updatedBookings = await adminService.getBookings();
      setBookings(updatedBookings);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['dashboard', 'bookings', 'rooms', 'users', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Stats Cards */}
                <div className="p-5 bg-white rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-500 bg-opacity-20">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-2xl font-semibold text-gray-700">{stats.totalBookings}</h4>
                      <div className="text-gray-500">Total Bookings</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-2xl font-semibold text-gray-700">{stats.activeGuests}</h4>
                      <div className="text-gray-500">Active Guests</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-2xl font-semibold text-gray-700">{stats.availableRooms}</h4>
                      <div className="text-gray-500">Available Rooms</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{booking.room}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{booking.checkIn}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{booking.checkOut}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button 
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              className={`${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'text-indigo-600 hover:text-indigo-900'}`}
                              disabled={booking.status === 'confirmed'}
                            >
                              {booking.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Bookings</h2>
              {/* Booking management content */}
              <p className="text-gray-600">All bookings will be listed here with management options.</p>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Room Management</h2>
              {/* Room management content */}
              <p className="text-gray-600">Manage hotel rooms, availability, and pricing here.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
              {/* User management content */}
              <p className="text-gray-600">Manage user accounts and permissions here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
              {/* Settings content */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Hotel Settings</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Update your hotel's settings and preferences.</p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;