import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
      setSelectedImage(0);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      await api.post(`/users/favorites/${id}`);
      setIsFavorite(true);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      await api.delete(`/users/favorites/${id}`);
      setIsFavorite(false);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const getImageUrl = (image) => {
    if (image?.url) {
      return image.url.startsWith('http') ? image.url : image.url;
    }
    return 'https://via.placeholder.com/600x800?text=No+Image';
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={getImageUrl(product.images?.[selectedImage])}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800?text=No+Image';
              }}
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt={`${product.title} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full">{product.category}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">{product.subcategory}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">{product.condition}</span>
              </div>
            </div>
            <button
              onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
              className="text-2xl"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Price */}
          <div className="mb-6 p-6 bg-gray-50 rounded-lg">
            {product.listingType === 'sale' || product.listingType === 'both' ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Sale Price</p>
                <p className="text-3xl font-bold text-primary-600">${product.price?.sale}</p>
              </div>
            ) : null}
            {product.listingType === 'rent' || product.listingType === 'both' ? (
              <div>
                <p className="text-sm text-gray-600">Rental Price</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${product.price?.rent?.perDay}/day
                </p>
                <p className="text-lg text-gray-700">
                  ${product.price?.rent?.perWeek}/week
                </p>
                {product.price?.rent?.deposit > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Deposit: ${product.price.rent.deposit}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.specifications.brand && (
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-semibold">{product.specifications.brand}</p>
                  </div>
                )}
                {product.specifications.size && (
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold">{product.specifications.size}</p>
                  </div>
                )}
                {product.specifications.color && (
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold">{product.specifications.color}</p>
                  </div>
                )}
                {product.specifications.material && (
                  <div>
                    <p className="text-sm text-gray-600">Material</p>
                    <p className="font-semibold">{product.specifications.material}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p className="text-gray-700">
              {product.location?.city}, {product.location?.state || product.location?.country}
            </p>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className="mb-6 p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Seller Information</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={product.seller.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.seller.name)}
                    alt={product.seller.name}
                    className="w-12 h-12 rounded-full mr-3"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.seller.name);
                    }}
                  />
                  <div>
                    <p className="font-semibold">{product.seller.name}</p>
                    <p className="text-sm text-gray-600">{product.seller.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {user?.id !== product.seller?._id && (
              <>
                <button className="btn btn-primary w-full py-3 text-lg">
                  Contact Seller
                </button>
                {product.listingType === 'rent' || product.listingType === 'both' ? (
                  <button className="btn btn-outline w-full py-3 text-lg">
                    Request Rental
                  </button>
                ) : null}
              </>
            )}
            {user?.id === product.seller?._id && (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary w-full py-3 text-lg"
              >
                Manage Listing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
