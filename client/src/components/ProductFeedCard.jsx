import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import RentalStatusBanner from './RentalStatusBanner';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

const API_URL = import.meta.env.VITE_API_URL;

const ProductFeedCard = ({ product }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(product.commentsCount || 0);

  const handleView = async () => {
    try {
      await axios.post(`${API_URL}/feed/${product._id}/view`);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const getImageUrl = (url) => {
    if (url?.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}/uploads/${url}`;
  };

  const formatPrice = (price) => {
    if (product.listingType === 'rent' || product.listingType === 'both') {
      return `$${price?.rent?.perDay || 0}/day`;
    }
    return `$${price?.sale || 0}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* User Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${product.seller?._id}`} className="flex items-center space-x-3">
          <img
            src={product.seller?.avatar || '/default-avatar.png'}
            alt={product.seller?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              {product.seller?.name}
              {product.seller?.premium?.isActive && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  ⭐ PRO
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">@{product.seller?.username || 'user'}</p>
          </div>
        </Link>
        
        {product.boosted?.isActive && (
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            🚀 Boosted
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/products/${product._id}`} onClick={handleView}>
        <div className="relative aspect-square bg-gray-100">
          <img
            src={getImageUrl(product.images?.[0]?.url || product.images?.[0])}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          
          {/* Rental Status Badge */}
          {(product.listingType === 'rent' || product.listingType === 'both') && 
           product.currentRental?.isRented && (
            <div className="absolute top-3 left-3">
              <RentalStatusBanner rental={product.currentRental} compact />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Multiple Images Indicator */}
          {product.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              📷 {product.images.length}
            </div>
          )}
        </div>
      </Link>

      {/* Engagement Bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <LikeButton
              targetType="Product"
              targetId={product._id}
              initialLikesCount={likesCount}
              onLikeChange={(newCount) => setLikesCount(newCount)}
            />
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{commentsCount}</span>
            </button>

            <button className="text-gray-700 hover:text-indigo-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {user && (
            <button className="text-gray-700 hover:text-red-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
          {product.views > 0 && <span>{product.views.toLocaleString()} views</span>}
          {product.waitlistCount > 0 && (
            <span className="text-orange-600 font-medium">
              🔥 {product.waitlistCount} waiting
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-gray-900 text-lg hover:text-indigo-600">
              {product.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(product.price)}
              </span>
              {product.listingType === 'both' && (
                <span className="text-xs text-gray-500">
                  or ${product.price?.sale} to buy
                </span>
              )}
            </div>

            <Link
              to={`/products/${product._id}`}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>

          {/* Rental Status Full Banner */}
          {(product.listingType === 'rent' || product.listingType === 'both') && 
           product.rentalStatus && (
            <div className="mt-3">
              <RentalStatusBanner 
                rental={product.rentalStatus} 
                productId={product._id}
              />
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200">
          <CommentSection 
            productId={product._id}
            onCommentCountChange={(newCount) => setCommentsCount(newCount)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductFeedCard;
