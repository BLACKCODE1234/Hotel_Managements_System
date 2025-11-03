import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Bookings', href: '/admin/bookings', icon: ClipboardDocumentListIcon },
  { name: 'Rooms', href: '/admin/rooms', icon: BuildingOfficeIcon },
  { name: 'Guests', href: '/admin/guests', icon: UserGroupIcon },
  { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export const AdminLayout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className={`fixed inset-0 z-40 flex ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Hotel Admin</h1>
              <button
                type="button"
                className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-5 h-full flex-shrink-0 divide-y divide-gray-200 overflow-y-auto" aria-label="Sidebar">
              <div className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      currentPath === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        currentPath === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Hotel Admin</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2" aria-label="Sidebar">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    currentPath.startsWith(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      currentPath.startsWith(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="h-9 w-9 text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name || 'Admin User'}
                  </p>
                  <button
                    onClick={onLogout}
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center"
                  >
                    <ArrowLeftOnRectangleIcon className="mr-1 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Search bar can be added here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50"
                    id="user-menu-button"
                  >
                    <UserCircleIcon className="h-8 w-8 text-gray-500 lg:hidden" />
                    <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                      <span className="sr-only">Open user menu for </span>
                      {user?.name || 'Admin User'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
