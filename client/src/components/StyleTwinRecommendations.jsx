import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Style Twin Recommendations - AI-powered matching
 * Shows items "Rented by users with your style"
 */
const StyleTwinRecommendations = ({ userId, userLocation }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [styleTwins, setStyleTwins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchStyleTwinRecommendations();
    }
  }, [userId]);

  const fetchStyleTwinRecommendations = async () => {
    try {
      setLoading(true);
      
      // Fetch style twin recommendations from backend
      const response = await axios.get(`/api/users/${userId}/style-twins-recommendations`, {
        params: {
          lat: userLocation?.lat,
          lng: userLocation?.lng,
          limit: 12
        }
      });

      setRecommendations(response.data.recommendations || []);
      setStyleTwins(response.data.styleTwins || []);
    } catch (error) {
      console.error('Error fetching style twin recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg mb-6">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="font-semibold text-gray-700">AI Powered</span>
          </div>

          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Your Style Twins Love These
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on <span className="font-bold">{styleTwins.length} users</span> with similar body type, skin tone, and style preferences
          </p>
        </div>

        {/* Style Twin Avatars */}
        {styleTwins.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="flex -space-x-4">
              {styleTwins.slice(0, 5).map((twin, index) => (
                <div
                  key={twin._id}
                  className="relative group cursor-pointer"
                  style={{ zIndex: 10 - index }}
                >
                  <img
                    src={twin.avatar || '/default-avatar.png'}
                    alt={`Style twin ${index + 1}`}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap">
                      {twin.matchScore}% style match
                    </div>
                  </div>
                </div>
              ))}
              
              {styleTwins.length > 5 && (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
                  +{styleTwins.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((item, index) => (
            <StyleTwinProductCard 
              key={item._id} 
              product={item}
              styleTwinCount={item.styleTwinRentalCount}
              index={index}
            />
          ))}
        </div>

        {/* Why This Works Section */}
        <div className="mt-16 p-8 bg-white rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-center mb-8">How We Find Your Style Twins</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MatchingFactor
              icon="👤"
              title="Body Type"
              description="Height, size, and proportions"
              weight="40%"
            />
            <MatchingFactor
              icon="🎨"
              title="Skin Tone"
              description="Perfect color matches"
              weight="15%"
            />
            <MatchingFactor
              icon="❤️"
              title="Style Preferences"
              description="Colors, brands, occasions"
              weight="30%"
            />
            <MatchingFactor
              icon="⭐"
              title="Rental History"
              description="What similar users loved"
              weight="15%"
            />
          </div>
        </div>

        {/* Complete Your Profile CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Get Even Better Recommendations</h3>
          <p className="text-xl mb-6 opacity-90">
            Complete your style profile to unlock personalized size recommendations and see how items look on people just like you
          </p>
          <button className="px-10 py-4 bg-white text-purple-600 text-xl font-bold rounded-full shadow-xl transform hover:scale-105 transition-all">
            Complete My Profile
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Style Twin Product Card
 */
const StyleTwinProductCard = ({ product, styleTwinCount, index }) => {
  const [showTwinPhotos, setShowTwinPhotos] = useState(false);

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Image */}
      <div 
        className="relative aspect-[3/4] overflow-hidden cursor-pointer"
        onMouseEnter={() => setShowTwinPhotos(true)}
        onMouseLeave={() => setShowTwinPhotos(false)}
      >
        <img
          src={product.images?.[0]?.url || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Style Twin Badge */}
        <div className="absolute top-3 left-3 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{styleTwinCount || 0} twins</span>
          </div>
        </div>

        {/* Overlay with twin photos */}
        {showTwinPhotos && product.styleTwinPhotos && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="text-center text-white">
              <p className="text-sm font-semibold mb-3">How it looks on people like you:</p>
              <div className="grid grid-cols-2 gap-2">
                {product.styleTwinPhotos.slice(0, 4).map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Style twin ${i + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.title}</h3>
        
        {/* Size recommendation */}
        {product.recommendedSize && (
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-600">
              Size {product.recommendedSize} recommended
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price?.rent?.perDay || product.pricePerDay}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            Rent
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Matching Factor Component
 */
const MatchingFactor = ({ icon, title, description, weight }) => {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
        {weight} weight
      </span>
    </div>
  );
};

// Keyframe animation for fade in
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default StyleTwinRecommendations;
