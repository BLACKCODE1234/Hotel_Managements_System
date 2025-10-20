import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Rooms', href: '/rooms', icon: BuildingOfficeIcon },
    { name: 'Services', href: '/services', icon: BuildingOfficeIcon },
    { name: 'Contact', href: '/contact', icon: BuildingOfficeIcon },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-gold-600 mr-2" />
              <span className="font-serif text-2xl font-bold text-luxury-800">
                Luxury Hotel
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-luxury-700 hover:text-gold-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-luxury-700 hover:text-gold-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-luxury-600" />
                  <span className="text-sm text-luxury-700">
                    {user.firstname} {user.lastname}
                  </span>
                  <span className="text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-luxury-700 hover:text-red-600 p-2 transition-colors duration-200"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-luxury-700 hover:text-gold-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-luxury-700 hover:text-gold-600 p-2"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-luxury-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-luxury-700 hover:text-gold-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-luxury-700 hover:text-gold-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2">
                  <div className="text-sm text-luxury-700 mb-2">
                    {user.firstname} {user.lastname}
                  </div>
                  <span className="text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 block px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-luxury-700 hover:text-gold-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary block text-center mx-3 my-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
