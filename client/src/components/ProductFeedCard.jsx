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

  const getImageUrl = (image) => {
    // Handle different image formats
    if (!image) return 'https://images.unsplash.com/photo-1558769132-cb1aea3f9a5e?w=800';
    
    if (typeof image === 'string') {
      if (image.startsWith('http')) return image;
      return `${API_URL.replace('/api', '')}/uploads/${image}`;
    }
    
    if (image.url) {
      if (image.url.startsWith('http')) return image.url;
      return `${API_URL.replace('/api', '')}/uploads/${image.url}`;
    }
    
    return 'https://images.unsplash.com/photo-1558769132-cb1aea3f9a5e?w=800';
  };

  const formatPrice = (price) => {
    if (product.listingType === 'rent' || product.listingType === 'both') {
      return `₹${price?.rent?.perDay || 0}/day`;
    }
    return `₹${price?.sale || 0}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* User Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${product.seller?._id}`} className="flex items-center space-x-3 group">
          <div className="relative">
            <img
              src={product.seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller?.name || 'User')}&background=6366f1&color=fff`}
              alt={product.seller?.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-indigo-400 transition-all"
            />
            {product.seller?.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 flex items-center gap-2 group-hover:text-indigo-600 transition">
              {product.seller?.name}
              {product.seller?.premium?.isActive && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                  ⭐ PRO
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {product.location?.city || 'Location unavailable'}
            </p>
          </div>
        </Link>
        
        {product.boosted?.isActive && (
          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-semibold shadow-md">
            🚀 Boosted
          </span>
        )}
      </div>

      {/* Product Image - Instagram Style */}
      <Link to={`/products/${product._id}`} onClick={handleView}>
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden group">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea3f9a5e?w=800';
            }}
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rental Status Badge */}
          {(product.listingType === 'rent' || product.listingType === 'both') && 
           product.currentRental?.isRented && (
            <div className="absolute top-3 left-3">
              <RentalStatusBanner rental={product.currentRental} compact />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
              {product.category}
            </span>
          </div>
          
          {/* Condition Badge */}
          {product.condition === 'New' && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ✨ NEW
              </span>
            </div>
          )}

          {/* Multiple Images Indicator */}
          {product.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              {product.images.length}
            </div>
          )}
          
          {/* Quick View Button on Hover */}
          <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-100 transition">
              View Details →
            </span>
          </button>
        </div>
      </Link>

      {/* Engagement Bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-5">
            <LikeButton
              targetType="Product"
              targetId={product._id}
              initialLikesCount={likesCount}
              onLikeChange={(newCount) => setLikesCount(newCount)}
            />
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1.5 text-gray-700 hover:text-indigo-600 transition group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-semibold">{commentsCount}</span>
            </button>

            <button className="text-gray-700 hover:text-indigo-600 transition group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {user && (
            <button className="text-gray-700 hover:text-red-500 transition group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
          {likesCount > 0 && (
            <span className="font-medium">{likesCount.toLocaleString()} like{likesCount !== 1 ? 's' : ''}</span>
          )}
          {product.views > 0 && <span>{product.views.toLocaleString()} views</span>}
          {product.waitlistCount > 0 && (
            <span className="text-orange-600 font-semibold">
              🔥 {product.waitlistCount} waiting
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-gray-900 text-lg mb-1 hover:text-indigo-600 transition line-clamp-2">
              {product.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {product.listingType === 'both' && (
                <span className="text-xs text-gray-500">
                  or ₹{product.price?.sale?.toLocaleString()} to buy
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold w-fit">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <Link
              to={`/products/${product._id}`}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {product.listingType === 'rent' ? 'Rent Now' : product.listingType === 'both' ? 'Rent/Buy' : 'Buy Now'}
            </Link>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.tags.slice(0, 4).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

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
