import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData, 'login');
      
      if (result.success) {
        toast.success(result.message);
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif font-bold text-luxury-800">
            Guest Login
          </h2>
          <p className="mt-2 text-sm text-luxury-600">
            Welcome back! Please sign in to your account
          </p>
        </div>
        
        <div className="card-luxury p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-luxury-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-luxury-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-luxury pl-10"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-luxury-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-luxury-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-luxury pl-10 pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-luxury-400 hover:text-luxury-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-luxury-400 hover:text-luxury-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-luxury-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-gold-600 hover:text-gold-500 transition-colors duration-200">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="border-t border-luxury-200 pt-6">
              <p className="text-center text-sm text-luxury-600 mb-4">
                Staff & Admin Access
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/admin-login"
                  className="text-center text-sm text-luxury-700 hover:text-gold-600 transition-colors duration-200"
                >
                  Admin Login
                </Link>
                <Link
                  to="/staff-login"
                  className="text-center text-sm text-luxury-700 hover:text-gold-600 transition-colors duration-200"
                >
                  Staff Login
                </Link>
                <Link
                  to="/superadmin-login"
                  className="text-center text-sm text-luxury-700 hover:text-gold-600 transition-colors duration-200"
                >
                  Super Admin Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
