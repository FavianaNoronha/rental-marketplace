import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import BentoGrid, { BentoCard, BentoHero, BentoStat, BentoCategory, BentoProduct } from '../components/BentoGrid';
import TrustBadge, { TrustScore } from '../components/TrustBadge';
import DigitalConcierge from '../components/DigitalConcierge';
import DigitalBazaar from '../components/DigitalBazaar';
import DigitalThriftShop from '../components/DigitalThriftShop';
import SecurityArchitecture from '../components/SecurityArchitecture';
import AIStyling from '../components/AIStyling';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConcierge, setShowConcierge] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=8&sort=popular');
      setFeaturedProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Clothes', icon: '👔', color: 'mocha', image: 'https://via.placeholder.com/300x200?text=Clothes', count: 1200 },
    { name: 'Shoes', icon: '👟', color: 'coolBlue', image: 'https://via.placeholder.com/300x200?text=Shoes', count: 430 },
    { name: 'Jewelry', icon: '💍', color: 'gold', image: 'https://via.placeholder.com/300x200?text=Jewelry', count: 680 },
    { name: 'Accessories', icon: '👜', color: 'mermaid', image: 'https://via.placeholder.com/300x200?text=Accessories', count: 520 },
    { name: 'Gadgets', icon: '📱', color: 'coolBlue', image: 'https://via.placeholder.com/300x200?text=Gadgets', count: 250 },
    { name: 'Bags', icon: '🎒', color: 'taupe', image: 'https://via.placeholder.com/300x200?text=Bags', count: 340 },
    { name: 'Traditional Wear', icon: '🪔', color: 'gold', image: 'https://via.placeholder.com/300x200?text=Traditional', count: 890 },
    { name: 'Other', icon: '✨', color: 'mermaid', image: 'https://via.placeholder.com/300x200?text=Other', count: 180 },
  ];

  return (
    <div className="min-h-screen">
      {/* Premium Free Platform Banner with 2026 Aesthetic */}
      <div className="bg-gradient-to-r from-mocha-600 via-gold-500 to-mermaid-500 text-white py-4 text-center font-display font-bold text-lg">
        <div className="container flex flex-wrap items-center justify-center gap-2">
          <span className="text-2xl">🎉</span>
          <span>100% FREE TO USE</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Zero Platform Fees</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Professional Security</span>
          <span className="text-2xl">🎉</span>
        </div>
      </div>

      {/* Hero Section - Sophisticated Luxury 2026 */}
      <section className="relative bg-gradient-to-br from-mocha-500 via-taupe-600 to-charcoal-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold-400 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-mermaid-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-lg md:text-display-xl font-serif mb-6 animate-fade-in">
              The Future of Fashion is{' '}
              <span className="text-gradient-gold inline-block">Circular</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-body opacity-90 animate-slide-up">
              Buy, Sell, & Bid on Fashion, Jewelry, and Gadgets in India's Most Elegant Resale Marketplace
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-10 text-sm md:text-base animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="glass px-4 py-2 rounded-full">✓ AI Authentication</span>
              <span className="glass px-4 py-2 rounded-full">✓ Escrow Protected</span>
              <span className="glass px-4 py-2 rounded-full">✓ Hygiene Certified</span>
              <span className="glass px-4 py-2 rounded-full">✓ KYC Verified</span>
              <span className="glass px-4 py-2 rounded-full">✓ Carbon Neutral</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/products" className="btn btn-luxury px-10 py-4 text-lg shadow-luxury">
                Explore Collection
              </Link>
              <button 
                onClick={() => setShowConcierge(true)}
                className="btn glass px-10 py-4 text-lg border-2 border-white/30"
              >
                Personal Concierge ✨
              </button>
            </div>

            {/* Trust Score Display */}
            <div className="mt-12 flex justify-center">
              <TrustScore score={96} reviews={15420} className="glass-dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Featured Content */}
      <section className="py-16 bg-gradient-to-br from-white via-mocha-50/30 to-mermaid-50/30">
        <div className="container">
          <BentoGrid>
            {/* Hero Card */}
            <BentoHero
              size="large"
              title="Exclusive Trunk Show"
              description="Limited collection of handpicked designer sarees and jewelry available for 48 hours only"
              badge="✨ Limited Edition"
              cta="Shop Now"
              ctaLink="/products?collection=trunk-show"
              image="https://via.placeholder.com/800x600?text=Trunk+Show"
            />

            {/* Stats */}
            <BentoStat
              label="Active Listings"
              value="4.2K"
              icon="📦"
              trend={12}
              color="mocha"
            />
            <BentoStat
              label="Happy Users"
              value="15K+"
              icon="😊"
              trend={18}
              color="mermaid"
            />
            <BentoStat
              label="CO₂ Saved"
              value="2.4T"
              icon="🌱"
              trend={25}
              color="coolBlue"
            />

            {/* Featured Category Highlight */}
            <BentoCard size="medium" gradient className="flex flex-col justify-between">
              <div>
                <span className="badge badge-gold mb-3">Trending</span>
                <h3 className="text-2xl font-serif font-bold mb-2">Pre-Loved Gadgets</h3>
                <p className="text-sm text-charcoal-600 mb-4">
                  Laptops, cameras, gaming consoles & more. Get premium tech at unbeatable prices.
                </p>
              </div>
              <Link to="/products?category=Gadgets" className="btn btn-cool w-full">
                Explore Gadgets
              </Link>
            </BentoCard>

            {/* AI Feature Highlight */}
            <BentoCard size="medium" className="bg-gradient-to-br from-coolBlue-500 to-mermaid-500 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4">🤖</div>
                  <h3 className="text-2xl font-serif font-bold mb-2">AI Styling</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Upload your wardrobe and get personalized outfit recommendations powered by AI
                  </p>
                </div>
                <button className="btn bg-white text-coolBlue-600 hover:bg-charcoal-50 w-full">
                  Try Now
                </button>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* Categories - Bento Grid Style */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-display-md font-serif text-luxury mb-4">Shop by Category</h2>
            <p className="text-lg text-charcoal-600 font-body max-w-2xl mx-auto">
              From traditional ethnic wear to modern gadgets, discover everything you need
            </p>
          </div>
          <BentoGrid>
            {categories.map((category) => (
              <BentoCategory
                key={category.name}
                name={category.name}
                icon={category.icon}
                image={category.image}
                count={category.count}
                link={`/products?category=${category.name}`}
                color={category.color}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Digital Bazaar Section */}
      <DigitalBazaar />

      {/* Digital Thrift Shop - Treasure Hunt */}
      <DigitalThriftShop />

      {/* Featured Products with Bento Grid */}
      <section className="py-16 bg-gradient-to-br from-white to-peach-50/30">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-display-md font-serif text-luxury">Trending Now</h2>
              <p className="text-charcoal-600 font-body">Most loved items this week</p>
            </div>
            <Link to="/products" className="btn btn-outline hidden md:inline-flex">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-coral-200" />
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coral-600 absolute top-0" />
              </div>
            </div>
          ) : (
            <BentoGrid>
              {featuredProducts.map((product) => (
                <BentoProduct key={product._id} product={product} size="medium" />
              ))}
            </BentoGrid>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-20 card-bento">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-charcoal-600 mb-4 font-body">No products available yet</p>
              <p className="text-charcoal-500 mb-6">Be the first to list an item and start earning!</p>
              <Link to="/create-listing" className="btn btn-luxury">
                Create Listing
              </Link>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="btn btn-outline w-full sm:w-auto">
              View All Items
            </Link>
          </div>
        </div>
      </section>

      {/* AI Styling Section */}
      <AIStyling />

      {/* Professional Security Architecture */}
      <SecurityArchitecture />

      {/* Sustainability Impact */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-mermaid-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6 animate-float">🌍</div>
            <h2 className="text-display-md font-serif text-luxury mb-6">
              Your Impact on the Planet
            </h2>
            <p className="text-xl text-charcoal-600 font-body mb-12">
              Join 15,000+ conscious consumers reducing fashion waste and carbon emissions
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card-bento p-6">
                <p className="text-4xl font-display font-bold text-green-600 mb-2">2.4T</p>
                <p className="text-sm text-charcoal-600">CO₂ Saved</p>
              </div>
              <div className="card-bento p-6">
                <p className="text-4xl font-display font-bold text-coolBlue-600 mb-2">890M</p>
                <p className="text-sm text-charcoal-600">Liters of 💧</p>
              </div>
              <div className="card-bento p-6">
                <p className="text-4xl font-display font-bold text-gold-600 mb-2">1.2M</p>
                <p className="text-sm text-charcoal-600">Items Reused</p>
              </div>
              <div className="card-bento p-6">
                <p className="text-4xl font-display font-bold text-mermaid-600 mb-2">₹48Cr</p>
                <p className="text-sm text-charcoal-600">Money Saved</p>
              </div>
            </div>

            <div className="mt-12 p-8 glass rounded-2xl border border-white/20">
              <h3 className="text-2xl font-serif font-bold mb-4">
                Circular Fashion is the Future
              </h3>
              <p className="text-charcoal-700 font-body mb-6">
                Every secondhand purchase prevents one new garment from being manufactured, 
                saving an average of 24kg of CO₂ and 2,700 liters of water. Together, 
                we're building a sustainable fashion ecosystem for India.
              </p>
              <Link to="/register" className="btn btn-cool">
                Join the Movement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Concierge Modal */}
      {showConcierge && <DigitalConcierge onClose={() => setShowConcierge(false)} />}
    </div>
  );
};

export default Home;
