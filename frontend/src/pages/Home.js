import React from 'react';
import { Link } from 'react-router-dom';
import { 
  StarIcon, 
  WifiIcon, 
  TruckIcon, 
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';

const Home = () => {
  const features = [
    {
      icon: StarIcon,
      title: '5-Star Luxury',
      description: 'Experience world-class hospitality with premium amenities and services.'
    },
    {
      icon: WifiIcon,
      title: 'Free WiFi',
      description: 'Stay connected with complimentary high-speed internet throughout the property.'
    },
    {
      icon: TruckIcon,
      title: 'Valet Parking',
      description: 'Convenient valet parking service available 24/7 for all guests.'
    },
    {
      icon: UserGroupIcon,
      title: 'Concierge Service',
      description: 'Our dedicated concierge team is here to assist with all your needs.'
    }
  ];

  const rooms = [
    {
      name: 'Deluxe Suite',
      price: '$299',
      image: '/images/hotel-suite.jpg',
      features: ['Ocean View', 'King Bed', 'Marble Bathroom', 'Private Balcony']
    },
    {
      name: 'Presidential Suite',
      price: '$599',
      image: '/images/hotel-suite.jpg',
      features: ['Panoramic View', 'Living Room', 'Jacuzzi', 'Butler Service']
    },
    {
      name: 'Executive Room',
      price: '$199',
      image: '/images/hotel-suite.jpg',
      features: ['City View', 'Work Desk', 'Premium Amenities', 'Express Check-in']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/hotel-exterior.jpg')`
          }}
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Welcome to Luxury Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience unparalleled luxury and comfort in the heart of paradise. 
            Where every moment becomes a cherished memory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Book Your Stay
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Guest Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-luxury-600 max-w-2xl mx-auto">
              Discover the exceptional amenities and services that make your stay unforgettable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-6 group-hover:bg-gold-200 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-luxury-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 bg-luxury-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-800 mb-4">
              Luxury Accommodations
            </h2>
            <p className="text-lg text-luxury-600 max-w-2xl mx-auto">
              Choose from our collection of elegantly appointed rooms and suites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div key={index} className="card-luxury">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-serif font-semibold text-luxury-800">
                      {room.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gold-600">
                        {room.price}
                      </span>
                      <span className="text-luxury-600 text-sm block">
                        per night
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {room.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-luxury-600">
                        <StarIcon className="h-4 w-4 text-gold-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full btn-primary">
                    Reserve Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resort Image Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-800 mb-6">
                Paradise Awaits
              </h2>
              <p className="text-lg text-luxury-600 mb-6">
                Immerse yourself in breathtaking ocean views, pristine beaches, and world-class amenities. 
                Our resort offers the perfect blend of relaxation and adventure, creating memories that last a lifetime.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gold-600 mr-3" />
                  <span className="text-luxury-700">Prime beachfront location</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gold-600 mr-3" />
                  <span className="text-luxury-700">24/7 guest services</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gold-600 mr-3" />
                  <span className="text-luxury-700">Multilingual staff</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/hotel-resort.jpg" 
                alt="Resort View"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready for Your Luxury Escape?
          </h2>
          <p className="text-xl mb-8 text-luxury-200">
            Join thousands of satisfied guests who have experienced our world-class hospitality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </Link>
            <div className="flex gap-4 justify-center">
              <Link to="/admin-login" className="text-luxury-300 hover:text-white px-4 py-2 text-sm transition-colors duration-200">
                Admin Login
              </Link>
              <Link to="/staff-login" className="text-luxury-300 hover:text-white px-4 py-2 text-sm transition-colors duration-200">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
