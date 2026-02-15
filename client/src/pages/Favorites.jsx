import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/users/favorites/me');
      setFavorites(data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">
            Start adding items to your favorites to see them here!
          </p>
          <a href="/products" className="btn btn-primary">
            Browse Products
          </a>
        </div>
      )}
    </div>
  );
};

export default Favorites;
