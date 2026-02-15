import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { name: 'Clothes', icon: '👔', color: 'bg-blue-100' },
    { name: 'Shoes', icon: '👟', color: 'bg-green-100' },
    { name: 'Accessories', icon: '👜', color: 'bg-purple-100' },
    { name: 'Bags', icon: '🎒', color: 'bg-pink-100' },
    { name: 'Jewelry', icon: '💍', color: 'bg-yellow-100' },
    { name: 'Other', icon: '✨', color: 'bg-indigo-100' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Rent & Sell Fashion Items
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your sustainable marketplace for clothes, shoes, and accessories.
            Save money, reduce waste, and look amazing!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Browse Items
            </Link>
            <Link to="/create-listing" className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 text-lg">
              List an Item
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">
                Upload photos, add details, and set your price for rent or sale
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Connect</h3>
              <p className="text-gray-600">
                Search for items, filter by category, and message sellers directly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rent or Buy</h3>
              <p className="text-gray-600">
                Complete transactions safely and enjoy your sustainable fashion choices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className={`${category.color} p-6 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-1`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Popular Items</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available yet. Be the first to list an item!</p>
              <Link to="/create-listing" className="btn btn-primary mt-4">
                Create Listing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RentStyle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold mb-2">Sustainable</h3>
              <p className="text-gray-600 text-sm">Reduce fashion waste and carbon footprint</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600 text-sm">Rent for occasions, save big on fashion</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">Protected transactions and verified users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600 text-sm">Simple interface, seamless experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
