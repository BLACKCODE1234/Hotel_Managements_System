import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmpassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmpassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(formData);
      
      if (result.success) {
        toast.success(result.message);
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif font-bold text-luxury-800">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-luxury-600">
            Join us for an exceptional luxury experience
          </p>
        </div>
        
        <div className="card-luxury p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-luxury-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-luxury-400" />
                  </div>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    className="input-luxury pl-10"
                    placeholder="First name"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-luxury-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-luxury-400" />
                  </div>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="input-luxury pl-10"
                    placeholder="Last name"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

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
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-luxury-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-luxury-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-luxury pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
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
                  placeholder="Create a password"
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
              <label htmlFor="confirmpassword" className="block text-sm font-medium text-luxury-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-luxury-400" />
                </div>
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="input-luxury pl-10 pr-10"
                  placeholder="Confirm your password"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-luxury-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-gold-600 hover:text-gold-500 transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
