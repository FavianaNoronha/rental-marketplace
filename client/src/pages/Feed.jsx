import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductFeedCard from '../components/ProductFeedCard';
import FeedFilters from '../components/FeedFilters';

const API_URL = import.meta.env.VITE_API_URL;

const Feed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'popular',
    category: '',
    listingType: '',
    city: ''
  });
  
  const observer = useRef();
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchProducts = async (pageNum, isNewFilter = false) => {
    try {
      setLoading(true);
      
      const params = {
        page: pageNum,
        limit: 20,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/feed`, { params });
      
      if (isNewFilter) {
        setProducts(response.data.data);
      } else {
        setProducts(prev => [...prev, ...response.data.data]);
      }
      
      setHasMore(response.data.pagination.hasMore);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    // Reset when filters change
    setPage(1);
    setProducts([]);
    fetchProducts(1, true);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">✨ Discover</h1>
          <p className="text-sm text-gray-600 mt-1">Find the perfect rental or buy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <FeedFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Feed */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {products.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or be the first to list!
            </p>
            <Link
              to="/create-listing"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product, index) => {
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductRef} key={product._id}>
                    <ProductFeedCard product={product} />
                  </div>
                );
              } else {
                return <ProductFeedCard key={product._id} product={product} />;
              }
            })}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* End of feed message */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">🎉 You've seen it all!</p>
            <p className="text-sm mt-2">Check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
