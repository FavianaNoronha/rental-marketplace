import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Destination Bundles - Travel Pack feature
 * Curated outfits delivered to your hotel
 */
const DestinationBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [loading, setLoading] = useState(true);

  const popularDestinations = [
    { id: 'all', name: 'All Destinations', icon: '🌍' },
    { id: 'goa', name: 'Goa', icon: '🏖️' },
    { id: 'udaipur', name: 'Udaipur', icon: '🏰' },
    { id: 'kerala', name: 'Kerala', icon: '🌴' },
    { id: 'jaipur', name: 'Jaipur', icon: '🕌' },
    { id: 'kashmir', name: 'Kashmir', icon: '🏔️' },
    { id: 'mumbai', name: 'Mumbai', icon: '🌆' }
  ];

  useEffect(() => {
    fetchBundles();
  }, [selectedDestination]);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const params = selectedDestination !== 'all' 
        ? { destination: selectedDestination }
        : {};

      const response = await axios.get('/api/bundles', { params });
      setBundles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg mb-6">
            <span className="text-2xl">✈️</span>
            <span className="font-semibold text-gray-700">Travel Packs</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Pack Less. Look <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">Flawless</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete destination wardrobes delivered to your hotel. 7 outfits for a 7-day trip. Zero luggage stress.
          </p>
        </div>

        {/* Destination Filters */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {popularDestinations.map(dest => (
            <button
              key={dest.id}
              onClick={() => setSelectedDestination(dest.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-full font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                selectedDestination === dest.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
              style={{ minHeight: '56px' }} // Larger touch target
            >
              <span className="text-2xl">{dest.icon}</span>
              <span className="text-lg">{dest.name}</span>
            </button>
          ))}
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <StepCard
            number="1"
            icon="📅"
            title="Pick Your Dates"
            description="Choose your travel destination and dates"
          />
          <StepCard
            number="2"
            icon="👗"
            title="Select Bundle"
            description="Get a curated wardrobe for your trip"
          />
          <StepCard
            number="3"
            icon="🏨"
            title="Hotel Delivery"
            description="Delivered to your hotel before check-in"
          />
          <StepCard
            number="4"
            icon="📦"
            title="Stress-Free Return"
            description="We pick up from your hotel at checkout"
          />
        </div>

        {/* Bundles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <BundleCard key={bundle._id} bundle={bundle} index={index} />
            ))}
          </div>
        )}

        {/* USP Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <USPCard
            icon="💰"
            title="Save ₹15,000+"
            description="Rent 7 designer outfits for less than buying one"
            color="from-green-400 to-emerald-500"
          />
          <USPCard
            icon="🌱"
            title="540 Liters of Water Saved"
            description="Every rental prevents manufacturing waste"
            color="from-blue-400 to-cyan-500"
          />
          <USPCard
            icon="📸"
            title="Instagram-Ready"
            description="Never repeat an outfit in your vacation photos"
            color="from-purple-400 to-pink-500"
          />
        </div>

        {/* Custom Bundle CTA */}
        <div className="mt-16 p-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl text-center text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">Need a Custom Bundle?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our stylists can create a personalized wardrobe based on your itinerary, weather, and planned activities
          </p>
          <button className="px-12 py-5 bg-white text-cyan-600 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
            Talk to a Stylist
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Step Card Component
 */
const StepCard = ({ number, icon, title, description }) => {
  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
      {/* Step Number */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
        {number}
      </div>
      
      <div className="text-5xl mb-4 mt-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

/**
 * Bundle Card Component
 */
const BundleCard = ({ bundle, index }) => {
  const savings = bundle.pricing?.discount?.percentage || 25;

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.15}s both`
      }}
    >
      {/* Main Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={bundle.coverImage || bundle.images?.[0]?.url || '/placeholder.jpg'}
          alt={bundle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Savings Badge */}
        <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-lg">
          Save {savings}%
        </div>

        {/* Climate Badge */}
        {bundle.destination?.climate && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold rounded-full shadow">
            {getClimateIcon(bundle.destination.climate)} {bundle.destination.climate}
          </div>
        )}

        {/* Product Count Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex -space-x-3">
            {bundle.products?.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden"
                style={{ zIndex: 10 - i }}
              >
                <img
                  src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {bundle.products?.length > 5 && (
              <div className="w-14 h-14 rounded-full bg-gray-800 text-white border-4 border-white shadow-lg flex items-center justify-center font-bold">
                +{bundle.products.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{bundle.description}</p>

        {/* Duration & Items */}
        <div className="flex gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{bundle.destination?.duration || 7} days</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span>{bundle.products?.length || 0} items</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 line-through mb-1">
              ₹{bundle.pricing?.individualTotal?.toLocaleString()}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ₹{bundle.pricing?.bundlePrice?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              for {bundle.destination?.duration || 7} days
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
          View Bundle
        </button>
      </div>
    </div>
  );
};

/**
 * USP Card Component
 */
const USPCard = ({ icon, title, description, color }) => {
  return (
    <div className={`p-8 bg-gradient-to-br ${color} rounded-2xl text-white shadow-xl`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-lg opacity-90">{description}</p>
    </div>
  );
};

/**
 * Helper to get climate icon
 */
const getClimateIcon = (climate) => {
  const icons = {
    tropical: '🌴',
    cold: '❄️',
    desert: '🏜️',
    moderate: '☀️'
  };
  return icons[climate] || '🌍';
};

export default DestinationBundles;
