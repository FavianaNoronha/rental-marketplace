import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import BentoGrid, { BentoCard, BentoHero, BentoStat, BentoProduct } from '../components/BentoGrid';
import PersonalizationModal from '../components/PersonalizationModal';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { TrustScore } from '../components/TrustBadge';
import DigitalConcierge from '../components/DigitalConcierge';
import DigitalBazaar from '../components/DigitalBazaar';
import DigitalThriftShop from '../components/DigitalThriftShop';
import SecurityArchitecture from '../components/SecurityArchitecture';
import AIStyling from '../components/AIStyling';
import TaskBasedNavigation from '../components/TaskBasedNavigation';
import FourPillars from '../components/FourPillars';

const Home = () => {
  const [tabData, setTabData] = useState({});
  const [loadingTabs, setLoadingTabs] = useState({});
  const [activeTab, setActiveTab] = useState('foryou');
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [showConcierge, setShowConcierge] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem('hasCompletedOnboarding');
    const savedPrefs = localStorage.getItem('userPreferences');
    
    if (!hasOnboarded) {
      setShowPersonalization(true);
    } else if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }
    
    // Load first tab only
    loadTabContent('foryou');
  }, []);

  // Lazy load tab content only when clicked
  const loadTabContent = async (tabId) => {
    // If already loaded, skip
    if (tabData[tabId]) return;

    setLoadingTabs(prev => ({ ...prev, [tabId]: true }));

    try {
      let endpoint = '/products?limit=12';
      
      switch(tabId) {
        case 'foryou':
          endpoint += '&sort=popular';
          break;
        case 'trending':
          endpoint += '&sort=trending';
          break;
        case 'nearby':
          endpoint += '&nearby=true';
          break;
        case 'new':
          endpoint += '&sort=createdAt&order=desc';
          break;
      }

      const { data } = await api.get(endpoint);
      setTabData(prev => ({ ...prev, [tabId]: data.data || [] }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setTabData(prev => ({ ...prev, [tabId]: [] }));
    } finally {
      setLoadingTabs(prev => ({ ...prev, [tabId]: false }));
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    loadTabContent(tabId); // Load on demand
  };

  const handlePersonalizationComplete = (prefs) => {
    setUserPreferences(prefs);
    setShowPersonalization(false);
    // Clear and reload
    setTabData({});
    loadTabContent('foryou');
  };

  const tabs = [
    { id: 'foryou', name: 'For You', icon: '✨', color: 'from-yellow-400 to-orange-500' },
    { id: 'trending', name: 'Trending', icon: '🔥', color: 'from-orange-400 to-red-500' },
    { id: 'nearby', name: 'Nearby', icon: '📍', color: 'from-green-400 to-teal-500' },
    { id: 'new', name: 'New', icon: '🆕', color: 'from-blue-400 to-purple-500' }
  ];

  const quickActions = [
    { name: 'Weddings', icon: '💒', link: '/products?occasion=wedding', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
    { name: 'Festivals', icon: '🎉', link: '/products?occasion=festival', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { name: 'Travel', icon: '✈️', link: '/products?occasion=travel', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    { name: 'Parties', icon: '🎊', link: '/products?occasion=party', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Bright Happy Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 dark:from-orange-600 dark:via-red-600 dark:to-pink-600 text-white py-12 md:py-16 overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl animate-float">👗</div>
          <div className="absolute top-20 right-20 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>👜</div>
          <div className="absolute bottom-10 left-1/4 text-4xl animate-float" style={{ animationDelay: '1s' }}>👠</div>
          <div className="absolute bottom-20 right-1/3 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>💍</div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main headline with creative quote */}
            <div className="mb-4">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-bounce-slow">
                ♻️ Sharing is Caring 💛
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Access Your Neighbour's Closet! 👚✨
            </h1>
            
            <p className="text-xl md:text-2xl mb-3 font-medium opacity-95">
              The Happy Way to Circular Fashion 🌟
            </p>
            
            <p className="text-lg md:text-xl mb-6 opacity-90">
              Rent, Share, Repeat - Because Every Outfit Deserves a Second Life! ♻️
            </p>

            {/* Trust Score */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">😊</span>
                  <div className="text-left">
                    <p className="text-2xl font-bold">15,420</p>
                    <p className="text-sm opacity-90">Happy Sharers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Bright pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {quickActions.map(action => (
                <Link
                  key={action.name}
                  to={action.link}
                  className={`${action.color} px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg`}
                >
                  {action.icon} {action.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/products" className="bg-white text-orange-600 px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl">
                Explore Collection
              </Link>
              <button 
                onClick={() => setShowConcierge(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white px-10 py-4 rounded-full text-lg font-bold transition-all"
              >
                Personal Concierge ✨
              </button>
            </div>

            {/* Personalize Button */}
            {userPreferences && (
              <button
                onClick={() => setShowPersonalization(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm transition-all"
              >
                ⚙️ Update My Vibe
              </button>
            )}
          </div>
        </div>
      </section>


      {/* Tabbed Content - LAZY LOADED! Only loads when clicked 🚀 */}
      <section className="py-8">
        <div className="container">
          {/* Colorful Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all transform ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-xl scale-105`
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 shadow-md'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          {/* Preferences Banner (only for "For You" tab) */}
          {activeTab === 'foryou' && userPreferences && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-5 mb-6 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                    Personalized Just for You! ✨
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.categories.slice(0, 3).map(cat => (
                      <span key={cat} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium shadow-sm">
                        {cat}
                      </span>
                    ))}
                    {userPreferences.occasions.slice(0, 3).map(occ => (
                      <span key={occ} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium shadow-sm">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Lazy Loaded */}
          <div className="mb-6">
            {loadingTabs[activeTab] ? (
              // Beautiful skeleton while loading
              <ProductGridSkeleton count={12} />
            ) : tabData[activeTab] && tabData[activeTab].length > 0 ? (
              // Actual products
              <BentoGrid>
                {tabData[activeTab].map((product) => (
                  <BentoProduct key={product._id} product={product} size="medium" />
                ))}
              </BentoGrid>
            ) : tabData[activeTab] && tabData[activeTab].length === 0 ? (
              // Empty state
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
                <div className="text-6xl mb-4">🎈</div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Nothing here yet!
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to share something amazing
                </p>
                <Link to="/create-listing" className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                  Start Sharing 🌟
                </Link>
              </div>
            ) : null}
          </div>

          {/* Show More Button */}
          {tabData[activeTab] && tabData[activeTab].length > 0 && (
            <div className="text-center">
              <Link 
                to="/products" 
                className="inline-block bg-gradient-to-r from-pink-400 to-purple-500 text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
              >
                Explore All Items 🚀
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bento Grid - Featured Content with Happy Theme */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Featured Collections ✨
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Curated picks just for you</p>
          </div>

          <BentoGrid>
            {/* AI Feature Highlight */}
            <BentoCard size="medium" className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">🤖</div>
                  <h3 className="text-2xl font-serif font-bold mb-2">AI Styling</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Upload your wardrobe and get personalized outfit recommendations powered by AI
                  </p>
                </div>
                <button className="btn bg-white text-orange-600 hover:bg-gray-50 w-full font-bold">
                  Try Now
                </button>
              </div>
            </BentoCard>

            {/* Featured Category Highlight */}
            <BentoCard size="medium" className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">Trending</span>
                  <h3 className="text-2xl font-serif font-bold mb-2 text-gray-800 dark:text-white">Pre-Loved Gadgets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Laptops, cameras, gaming consoles & more. Get premium tech at unbeatable prices.
                  </p>
                </div>
                <Link to="/products?category=Gadgets" className="btn bg-gradient-to-r from-pink-500 to-purple-500 text-white w-full font-bold">
                  Explore Gadgets
                </Link>
              </div>
            </BentoCard>

            {/* Stats Cards */}
            <BentoStat
              label="Active Listings"
              value="4.2K"
              icon="📦"
              trend={12}
              color="yellow"
            />
            <BentoStat
              label="Happy Sharers"
              value="15K+"
              icon="😊"
              trend={18}
              color="orange"
            />
          </BentoGrid>
        </div>
      </section>

      {/* Task-Based Navigation - Myntra-level Category Recall */}
      <TaskBasedNavigation />

      {/* Four Pillars - Professional Taxonomy */}
      <FourPillars />

      {/* Digital Bazaar Section */}
      <DigitalBazaar />

      {/* Digital Thrift Shop - Treasure Hunt */}
      <DigitalThriftShop />

      {/* AI Styling Section */}
      <AIStyling />

      {/* Professional Security Architecture */}
      <SecurityArchitecture />

      {/* Happy Stats Section - Sharing is Caring Theme */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Making the World Happier! 🌍💛
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Because sharing is caring ✨</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🌱</div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mb-1">2.4T</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-500">CO₂ Saved</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">😊</div>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 mb-1">15K+</p>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">Happy Sharers</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">♻️</div>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-1">1.2M</p>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-500">Items Shared</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-3xl font-bold text-pink-700 dark:text-pink-400 mb-1">₹48Cr</p>
              <p className="text-sm font-medium text-pink-600 dark:text-pink-500">Money Saved</p>
            </div>
          </div>

          {/* Motivational quote */}
          <div className="mt-10 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 p-8 rounded-3xl shadow-2xl max-w-2xl">
              <p className="text-2xl md:text-3xl font-bold text-white mb-3">
                "The Happy Way to Circular Fashion!" 🌟
              </p>
              <p className="text-white/90 text-lg mb-2">
                Why buy when you can borrow from your neighbor? 🏡
              </p>
              <p className="text-white/80 text-base">
                Join the sharing economy revolution - where style meets sustainability! 🚀✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personalization Modal */}
      {showPersonalization && (
        <PersonalizationModal
          onComplete={handlePersonalizationComplete}
          onSkip={() => {
            setShowPersonalization(false);
            localStorage.setItem('hasCompletedOnboarding', 'true');
          }}
        />
      )}

      {/* Digital Concierge Modal */}
      {showConcierge && <DigitalConcierge onClose={() => setShowConcierge(false)} />}
    </div>
  );
};

export default Home;
