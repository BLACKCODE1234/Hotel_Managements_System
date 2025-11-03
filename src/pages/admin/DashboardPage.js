import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HomeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { StatsCard } from '../../components/admin/StatsCard';
import { LineChart } from '../../components/admin/LineChart';
import { BarChart } from '../../components/admin/BarChart';
import { DataTable } from '../../components/admin/DataTable';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeGuests: 0,
    availableRooms: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    bookingTrend: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [roomOccupancy, setRoomOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all dashboard data in parallel
        const [statsData, bookingsData, revenueData, occupancyData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getBookings({ limit: 5 }),
          adminService.getRevenueStats({ period: 'monthly' }),
          adminService.getOccupancyRates()
        ]);

        setStats({
          totalBookings: statsData.totalBookings || 0,
          activeGuests: statsData.activeGuests || 0,
          availableRooms: statsData.availableRooms || 0,
          totalRevenue: statsData.totalRevenue || 0,
          monthlyRevenue: statsData.monthlyRevenue || 0,
          occupancyRate: statsData.occupancyRate || 0,
          bookingTrend: statsData.bookingTrend || 0
        });

        setRecentBookings(bookingsData || []);
        setRevenueData(revenueData || []);
        setRoomOccupancy(occupancyData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRowClick = (booking) => {
    navigate(`/admin/bookings/${booking.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Export
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          change={stats.bookingTrend}
          trend={stats.bookingTrend >= 0 ? 'up' : 'down'}
          icon={CalendarIcon}
        />
        <StatsCard
          title="Active Guests"
          value={stats.activeGuests}
          change={5.2}
          trend="up"
          icon={UserGroupIcon}
        />
        <StatsCard
          title="Available Rooms"
          value={stats.availableRooms}
          change={-2.1}
          trend="down"
          icon={HomeIcon}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change={12.5}
          trend="up"
          icon={CurrencyDollarIcon}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-80">
            <LineChart
              data={revenueData}
              xKey="date"
              yKeys={['revenue', 'bookings']}
              colors={['#3B82F6', '#10B981']}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Room Occupancy</h3>
          <div className="h-80">
            <BarChart
              data={roomOccupancy}
              xKey="roomType"
              yKeys={['occupancy']}
              colors={['#8B5CF6']}
              title=""
            />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Bookings</h3>
          <p className="mt-1 text-sm text-gray-500">A list of the most recent bookings.</p>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            columns={[
              { key: 'id', header: 'Booking ID', sortable: true },
              { 
                key: 'guestName', 
                header: 'Guest', 
                sortable: true,
                render: (row) => (
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{row.guestName}</div>
                      <div className="text-gray-500">{row.email}</div>
                    </div>
                  </div>
                )
              },
              { 
                key: 'roomType', 
                header: 'Room Type',
                sortable: true
              },
              { 
                key: 'checkIn', 
                header: 'Check-in / Check-out',
                render: (row) => (
                  <div>
                    <div>{new Date(row.checkIn).toLocaleDateString()}</div>
                    <div className="text-gray-500 text-sm">
                      to {new Date(row.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                )
              },
              { 
                key: 'status', 
                header: 'Status',
                sortable: true,
                render: (row) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : row.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                )
              },
              { 
                key: 'amount', 
                header: 'Amount',
                sortable: true,
                render: (row) => `$${row.amount?.toLocaleString()}`
              }
            ]}
            data={recentBookings}
            searchable
            pagination={false}
            onRowClick={handleRowClick}
          />
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => navigate('/admin/bookings')}
          >
            View all bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
