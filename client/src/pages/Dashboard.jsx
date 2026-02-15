import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    sold: 0,
    rented: 0
  });

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const { data } = await api.get(`/products/user/${user.id}`);
      setProducts(data.data || []);

      // Calculate stats
      const active = data.data.filter(p => p.status === 'active').length;
      const sold = data.data.filter(p => p.status === 'sold').length;
      const rented = data.data.filter(p => p.status === 'rented').length;

      setStats({ active, sold, rented });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      toast.success('Listing deleted successfully');
      fetchMyProducts();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Listings</p>
              <p className="text-3xl font-bold text-primary-600">{stats.active}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sold Items</p>
              <p className="text-3xl font-bold text-green-600">{stats.sold}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rented Items</p>
              <p className="text-3xl font-bold text-purple-600">{stats.rented}</p>
            </div>
            <div className="text-4xl">🔄</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link to="/create-listing" className="btn btn-primary">
          + Create New Listing
        </Link>
      </div>

      {/* My Listings */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6">My Listings</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition"
              >
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                  alt={product.title}
                  className="w-full md:w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <p className="text-sm text-gray-600">
                        {product.category} • {product.subcategory} • {product.condition}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                      product.status === 'rented' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    {product.price?.sale && (
                      <span className="text-primary-600 font-semibold">
                        ${product.price.sale} (Sale)
                      </span>
                    )}
                    {product.price?.rent?.perDay && (
                      <span className="text-purple-600 font-semibold">
                        ${product.price.rent.perDay}/day (Rent)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Views: {product.views || 0} • Listed: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-outline px-4 py-2 text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
            <Link to="/create-listing" className="btn btn-primary">
              Create Your First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
