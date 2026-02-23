import { useState, useEffect } from 'react';
import { getUserLocation, isInHyderabad, findNearestCluster, filterProductsByLocation } from '../utils/geolocation';
import { getPaletteForUser, generateCSSVariables } from '../utils/designSystem';
import HyderabadExpress from './HyderabadExpress';
import StyleTwinRecommendations from './StyleTwinRecommendations';
import DestinationBundles from './DestinationBundles';

/**
 * Dynamic Homepage that morphs based on user location and behavior
 * Implements "Hyderabad First" personalization strategy
 */
const DynamicHomepage = ({ user }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isHyderabadUser, setIsHyderabadUser] = useState(false);
  const [nearestCluster, setNearestCluster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorPalette, setColorPalette] = useState(null);

  useEffect(() => {
    initializeHomepage();
  }, [user]);

  const initializeHomepage = async () => {
    try {
      // Get user location
      const location = await getUserLocation();
      setUserLocation(location);

      // Check if in Hyderabad
      const inHyd = isInHyderabad(location);
      setIsHyderabadUser(inHyd);

      // Find nearest premium cluster
      if (inHyd) {
        const cluster = findNearestCluster(location);
        setNearestCluster(cluster);
      }

      // Get appropriate color palette based on user demographics
      const palette = getPaletteForUser(user);
      setColorPalette(palette);

      // Apply CSS variables
      if (palette) {
        const cssVars = generateCSSVariables(palette);
        Object.entries(cssVars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing homepage:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="dynamic-homepage" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section - Morphs based on location */}
      {isHyderabadUser ? (
        <HyderabadExpressHero 
          userLocation={userLocation}
          nearestCluster={nearestCluster}
          palette={colorPalette}
        />
      ) : (
        <NationalHero palette={colorPalette} />
      )}

      {/* Hyperlocal Products - Only for Hyderabad users */}
      {isHyderabadUser && (
        <HyderabadExpress 
          userLocation={userLocation}
          nearestCluster={nearestCluster}
        />
      )}

      {/* Style Twin Recommendations - AI-powered */}
      {user && (
        <StyleTwinRecommendations 
          userId={user._id}
          userLocation={userLocation}
        />
      )}

      {/* Contextual Content Blocks */}
      <ContextualBlocks 
        userBehavior={user?.recentSearches}
        userLocation={userLocation}
      />

      {/* AI Visual Search Section */}
      <VisualSearchSection />

      {/* UGC Gallery */}
      <UserGeneratedContent location={isHyderabadUser ? 'Hyderabad' : null} />

      {/* Digital Closet Tool */}
      {user && <DigitalClosetCTA />}
    </div>
  );
};

/**
 * Hyderabad Express Hero - 90-minute delivery focus
 */
const HyderabadExpressHero = ({ userLocation, nearestCluster, palette }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${palette?.primary[Object.keys(palette.primary)[0]]} 0%, ${palette?.accent[Object.keys(palette.accent)[0]]} 100%)`,
          animation: 'gradient-shift 15s ease infinite'
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Location badge */}
        {nearestCluster && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full mb-6 shadow-lg">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Serving {nearestCluster.name} • {nearestCluster.distance}km away
            </span>
          </div>
        )}

        {/* Main headline with gradient text */}
        <h1 
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          style={{ 
            fontFamily: palette?.name === 'Royal Noir Gold' ? "'Playfair Display', serif" : "'Inter', sans-serif"
          }}
        >
          <span 
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${palette?.primary[Object.keys(palette.primary)[0]]}, ${palette?.accent[Object.keys(palette.accent)[0]]})`
            }}
          >
            Your Hyderabad Closet
          </span>
        </h1>

        {/* 90-minute delivery badge */}
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full mb-8 shadow-2xl transform hover:scale-105 transition-transform">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xl font-bold">90-Minute Express Delivery</span>
        </div>

        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Rent luxury fashion from your neighborhood. Browse <span className="font-bold">500+ items</span> within 15km. Delivered before your chai gets cold.
        </p>

        {/* CTA Buttons - Large touch targets */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all"
            style={{
              backgroundColor: 'var(--color-highlight)',
              color: 'white',
              minWidth: '48px',
              minHeight: '48px' // WCAG touch target
            }}
          >
            Browse Nearby Items
          </button>
          <button 
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full border-2 bg-white/80 backdrop-blur-sm transform hover:scale-105 transition-all"
            style={{
              borderColor: 'var(--color-primary-1)',
              color: 'var(--color-primary-1)',
              minWidth: '48px',
              minHeight: '48px'
            }}
          >
            Emergency Fit Finder
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

/**
 * National Hero - For non-Hyderabad users
 */
const NationalHero = ({ palette }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          India's Premium Fashion Rental
        </h1>
        <p className="text-xl md:text-2xl mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          Luxury wardrobes, sustainable choices. Launching nationwide.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-full font-semibold">
          🚀 Coming to your city soon! Join the waitlist
        </div>
      </div>
    </section>
  );
};

/**
 * Contextual Content Blocks - Changes based on user behavior
 */
const ContextualBlocks = ({ userBehavior, userLocation }) => {
  const [displayMode, setDisplayMode] = useState('default');

  useEffect(() => {
    // Analyze user behavior to show relevant content
    if (userBehavior?.includes('travel') || userBehavior?.includes('vacation')) {
      setDisplayMode('destinations');
    } else if (userBehavior?.includes('wedding') || userBehavior?.includes('occasion')) {
      setDisplayMode('occasions');
    } else {
      setDisplayMode('trending');
    }
  }, [userBehavior]);

  if (displayMode === 'destinations') {
    return <DestinationBundles />;
  }

  return (
    <section className="py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">Trending in Your Area</h2>
      {/* Product grid */}
    </section>
  );
};

/**
 * AI Visual Search Section
 */
const VisualSearchSection = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        // TODO: Call AI visual search API
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6">Find It With a Photo</h2>
        <p className="text-xl mb-12 text-gray-600">
          Saw something on Instagram? Upload a photo and we'll find similar rentals near you.
        </p>
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="visual-search-upload"
          />
          <label
            htmlFor="visual-search-upload"
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-semibold rounded-full cursor-pointer shadow-2xl transform hover:scale-105 transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Photo
          </label>
        </div>

        {uploadedImage && (
          <div className="mt-8">
            <img src={uploadedImage} alt="Uploaded" className="max-w-xs mx-auto rounded-lg shadow-lg" />
            <p className="mt-4 text-lg font-medium">Searching for similar items...</p>
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * User-Generated Content Gallery
 */
const UserGeneratedContent = ({ location }) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4">
          {location ? `Style Inspiration from ${location}` : 'Real People, Real Style'}
        </h2>
        <p className="text-xl text-center mb-12 text-gray-600">
          See how your neighbors are rocking their rentals
        </p>
        {/* TODO: UGC Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Placeholder for UGC images */}
        </div>
      </div>
    </section>
  );
};

/**
 * Digital Closet CTA
 */
const DigitalClosetCTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6">Build Your Digital Closet</h2>
        <p className="text-2xl mb-8 opacity-90">
          Upload your wardrobe. Get AI-powered outfit completions. Never repeat an outfit.
        </p>
        <button className="px-12 py-6 bg-white text-indigo-600 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
          Create My Closet
        </button>
      </div>
    </section>
  );
};

export default DynamicHomepage;
