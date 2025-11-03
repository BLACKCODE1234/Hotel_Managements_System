import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked-in', label: 'Checked In' },
  { value: 'checked-out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
];

const roomTypeOptions = [
  { value: 'all', label: 'All Room Types' },
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'family', label: 'Family' },
];

const getStatusBadge = (status) => {
  const statusMap = {
    pending: { color: 'yellow', icon: ClockIcon },
    confirmed: { color: 'blue', icon: CheckCircleIcon },
    'checked-in': { color: 'green', icon: CheckCircleIcon },
    'checked-out': { color: 'gray', icon: CheckCircleIcon },
    cancelled: { color: 'red', icon: XCircleIcon },
  };

  const { color, icon: Icon } = statusMap[status] || { color: 'gray', icon: ClockIcon };
  
  return {
    element: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
        <Icon className={`h-3 w-3 mr-1 text-${color}-500`} />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    ),
    sortValue: status,
  };
};

const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    roomType: 'all',
    dateRange: [null, null],
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { page, pageSize } = pagination;
      const { status, roomType, dateRange, search } = filters;
      
      const params = {
        page,
        limit: pageSize,
        status: status === 'all' ? undefined : status,
        roomType: roomType === 'all' ? undefined : roomType,
        startDate: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : undefined,
        endDate: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : undefined,
        search: search || undefined,
      };

      const response = await adminService.getBookings(params);
      setBookings(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters, pagination.page, pagination.pageSize]);

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      page,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const columns = [
    {
      key: 'bookingId',
      header: 'Booking ID',
      sortable: true,
      render: (row) => `#${row.bookingId}`,
    },
    {
      key: 'guest',
      header: 'Guest',
      sortable: true,
      sortKey: 'guestName',
      render: (row) => (
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{row.guestName}</div>
            <div className="text-sm text-gray-500">{row.guestEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'room',
      header: 'Room',
      sortable: true,
      sortKey: 'roomType',
      render: (row) => (
        <div>
          <div className="font-medium">{row.roomNumber}</div>
          <div className="text-sm text-gray-500 capitalize">{row.roomType}</div>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      sortable: true,
      sortKey: 'checkIn',
      render: (row) => (
        <div>
          <div className="font-medium">
            {format(new Date(row.checkIn), 'MMM d, yyyy')}
          </div>
          <div className="text-sm text-gray-500">
            to {format(new Date(row.checkOut), 'MMM d, yyyy')}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => `$${row.totalAmount?.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => getStatusBadge(row.status).element,
      sortValue: (row) => getStatusBadge(row.status).sortValue,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            size="xs"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/bookings/${row.id}`);
            }}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={fetchBookings}
                icon={ArrowPathIcon}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all hotel bookings and reservations
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            icon={FunnelIcon}
            className="w-full sm:w-auto"
          >
            Filters
          </Button>
          <Button
            icon={PlusIcon}
            onClick={() => navigate('/admin/bookings/new')}
            className="w-full sm:w-auto"
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <Select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              options={roomTypeOptions}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={(range) => handleFilterChange('dateRange', range)}
              placeholder="Select date range"
            />
          </div>
          <div className="md:col-span-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Search by guest name, email, or booking ID"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={bookings}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
          }}
          onRowClick={(row) => navigate(`/admin/bookings/${row.id}`)}
          rowClassName="cursor-pointer hover:bg-gray-50"
        />
      </div>
    </div>
  );
};

export default BookingsPage;
