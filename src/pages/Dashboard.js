import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardConfig = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Hotel Management System',
          color: 'gold',
          stats: [
            { name: 'Total Rooms', value: '150', icon: BuildingOfficeIcon, change: '+2.1%' },
            { name: 'Occupied Rooms', value: '128', icon: UserIcon, change: '+5.4%' },
            { name: 'Revenue Today', value: '$24,580', icon: CurrencyDollarIcon, change: '+12.5%' },
            { name: 'Staff on Duty', value: '45', icon: UsersIcon, change: '+1.2%' }
          ]
        };
      case 'staff':
        return {
          title: 'Staff Dashboard',
          subtitle: 'Daily Operations',
          color: 'primary',
          stats: [
            { name: 'My Tasks', value: '12', icon: ClockIcon, change: '+3' },
            { name: 'Rooms to Clean', value: '8', icon: BuildingOfficeIcon, change: '-2' },
            { name: 'Check-ins Today', value: '15', icon: UserIcon, change: '+5' },
            { name: 'Notifications', value: '4', icon: BellIcon, change: '+1' }
          ]
        };
      case 'superadmin':
        return {
          title: 'Super Admin Dashboard',
          subtitle: 'System Management',
          color: 'red',
          stats: [
            { name: 'Total Hotels', value: '5', icon: BuildingOfficeIcon, change: '+1' },
            { name: 'System Users', value: '1,247', icon: UsersIcon, change: '+23' },
            { name: 'Monthly Revenue', value: '$847K', icon: CurrencyDollarIcon, change: '+8.2%' },
            { name: 'System Health', value: '99.9%', icon: ChartBarIcon, change: '+0.1%' }
          ]
        };
      default:
        return {
          title: 'Guest Dashboard',
          subtitle: 'Your Luxury Experience',
          color: 'gold',
          stats: [
            { name: 'Current Booking', value: 'Suite 205', icon: BuildingOfficeIcon, change: '' },
            { name: 'Check-out', value: 'Tomorrow', icon: CalendarIcon, change: '' },
            { name: 'Services Used', value: '3', icon: UserIcon, change: '+1' },
            { name: 'Loyalty Points', value: '2,450', icon: CurrencyDollarIcon, change: '+150' }
          ]
        };
    }
  };

  const config = getDashboardConfig();
  const colorClasses = {
    gold: {
      bg: 'bg-gold-50',
      border: 'border-gold-200',
      text: 'text-gold-800',
      accent: 'text-gold-600',
      button: 'bg-gold-600 hover:bg-gold-700'
    },
    primary: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-800',
      accent: 'text-primary-600',
      button: 'bg-primary-600 hover:bg-primary-700'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      accent: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };

  const colors = colorClasses[config.color];

  const quickActions = {
    guest: [
      { name: 'Room Service', description: 'Order food & beverages' },
      { name: 'Concierge', description: 'Request assistance' },
      { name: 'Spa Booking', description: 'Book wellness services' },
      { name: 'Checkout', description: 'Express checkout' }
    ],
    admin: [
      { name: 'Room Management', description: 'Manage room inventory' },
      { name: 'Staff Schedule', description: 'View staff assignments' },
      { name: 'Reports', description: 'Generate reports' },
      { name: 'Settings', description: 'System configuration' }
    ],
    staff: [
      { name: 'Room Status', description: 'Update room conditions' },
      { name: 'Guest Requests', description: 'Handle guest services' },
      { name: 'Maintenance', description: 'Report issues' },
      { name: 'Schedule', description: 'View my schedule' }
    ],
    superadmin: [
      { name: 'System Monitor', description: 'Monitor all systems' },
      { name: 'User Management', description: 'Manage all users' },
      { name: 'Analytics', description: 'View system analytics' },
      { name: 'Backup', description: 'System backup & restore' }
    ]
  };

  const actions = quickActions[user?.role] || quickActions.guest;

  return (
    <div className="min-h-screen bg-luxury-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`${colors.bg} ${colors.border} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-serif font-bold ${colors.text}`}>
                  {config.title}
                </h1>
                <p className="text-luxury-600 mt-1">{config.subtitle}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold ${colors.accent}`}>
                  Welcome back, {user?.firstname}!
                </p>
                <p className="text-sm text-luxury-600 capitalize">
                  Role: {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {config.stats.map((stat, index) => (
            <div key={index} className="card-luxury p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <stat.icon className={`h-6 w-6 ${colors.accent}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-luxury-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-luxury-900">{stat.value}</p>
                    {stat.change && (
                      <p className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-luxury p-6">
            <h2 className="text-xl font-serif font-semibold text-luxury-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 rounded-lg border border-luxury-200 hover:border-gold-300 hover:bg-gold-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-luxury-800">{action.name}</h3>
                      <p className="text-sm text-luxury-600">{action.description}</p>
                    </div>
                    <svg className="h-5 w-5 text-luxury-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-luxury p-6">
            <h2 className="text-xl font-serif font-semibold text-luxury-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                { action: 'Room 205 checked in', time: '2 minutes ago', type: 'checkin' },
                { action: 'Maintenance request completed', time: '15 minutes ago', type: 'maintenance' },
                { action: 'New booking received', time: '1 hour ago', type: 'booking' },
                { action: 'Staff shift change', time: '2 hours ago', type: 'staff' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'checkin' ? 'bg-green-500' :
                    activity.type === 'maintenance' ? 'bg-blue-500' :
                    activity.type === 'booking' ? 'bg-gold-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-luxury-800">{activity.action}</p>
                    <p className="text-xs text-luxury-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Images Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-luxury overflow-hidden">
            <img 
              src="/images/hotel-suite.jpg" 
              alt="Luxury Suite" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-serif font-semibold text-luxury-800">Luxury Suites</h3>
              <p className="text-sm text-luxury-600 mt-1">Experience ultimate comfort</p>
            </div>
          </div>
          
          <div className="card-luxury overflow-hidden">
            <img 
              src="/images/hotel-exterior.jpg" 
              alt="Hotel Exterior" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-serif font-semibold text-luxury-800">Grand Exterior</h3>
              <p className="text-sm text-luxury-600 mt-1">Iconic architecture & design</p>
            </div>
          </div>
          
          <div className="card-luxury overflow-hidden">
            <img 
              src="/images/hotel-resort.jpg" 
              alt="Resort View" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-serif font-semibold text-luxury-800">Resort Paradise</h3>
              <p className="text-sm text-luxury-600 mt-1">Beachfront luxury experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
