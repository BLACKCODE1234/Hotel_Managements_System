import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    room_type: 'standard',
    people: 1,
    check_in: '',
    duration: 1
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'people' || name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/hotel_booking', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setMessage(response.data.message || 'Booking successful!');
      // Optionally redirect after successful booking
      setTimeout(() => {
        navigate('/'); // Redirect to home or dashboard
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to make booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Room</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="room_type" className="block text-sm font-medium text-gray-700">Room Type</label>
              <select
                id="room_type"
                name="room_type"
                value={formData.room_type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label htmlFor="people" className="block text-sm font-medium text-gray-700">Number of People</label>
              <input
                type="number"
                id="people"
                name="people"
                min="1"
                max="10"
                value={formData.people}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="check_in" className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <input
                type="date"
                id="check_in"
                name="check_in"
                value={formData.check_in}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (Nights)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                min="1"
                max="30"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
