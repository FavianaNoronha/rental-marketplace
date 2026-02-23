import { useState, useEffect } from 'react';
import { formatDistance, estimateDeliveryTime } from '../utils/geolocation';
import axios from 'axios';

/**
 * Hyderabad Express - Hyperlocal 90-minute delivery section
 * Shows items within 15km radius with express delivery
 */
const HyderabadExpress = ({ userLocation, nearestCluster }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (userLocation) {
      fetchHyperlocalProducts();
    }
  }, [userLocation, filter]);

  const fetchHyperlocalProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 15, // 15km hyperlocal radius
          expressDelivery: true,
          category: filter !== 'all' ? filter : undefined,
          sort: 'distance'
        }
      });

      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hyperlocal products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                90-Min Express
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              {products.length} items near {nearestCluster?.name || 'you'} • Delivered before your event
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mt-6 md:mt-0 flex-wrap">
            {['all', 'Jewelry', 'Clothes', 'Accessories', 'Bags'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  filter === cat
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                style={{ minHeight: '48px' }} // Touch target
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Express Delivery Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <BenefitCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="90 Minutes or Free"
            description="Delivered within 90 minutes or your delivery is free"
          />
          <BenefitCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Live GPS Tracking"
            description="Track your delivery partner in real-time on the map"
          />
          <BenefitCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Same-Hour Pickup"
            description="We pick up from your doorstep when you're done"
          />
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <ExpressProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No items nearby</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </div>
        )}

        {/* Emergency Request CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Last-Minute Emergency? 🚨
          </h3>
          <p className="text-xl text-gray-800 mb-6">
            Flight in 3 hours? Dinner in 90 minutes? We've got you covered.
          </p>
          <button className="px-10 py-4 bg-gray-900 text-white text-xl font-bold rounded-full shadow-xl transform hover:scale-105 transition-all">
            Request Emergency Delivery
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Benefit Card Component
 */
const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

/**
 * Express Product Card with distance and delivery time
 */
const ExpressProductCard = ({ product }) => {
  const deliveryTime = estimateDeliveryTime(product.distance, true);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images?.[0]?.url || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Distance badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow-lg">
          {formatDistance(product.distance)}
        </div>

        {/* Express badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow-lg animate-pulse">
          ⚡ 90-MIN
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{deliveryTime}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price?.rent?.perDay || product.pricePerDay}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HyderabadExpress;
