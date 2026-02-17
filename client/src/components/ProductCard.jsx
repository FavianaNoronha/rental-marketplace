import { Link } from 'react-router-dom';
import TrustBadge from './TrustBadge';

const ProductCard = ({ product }) => {
  const getImageUrl = (image) => {
    if (image?.url) {
      return image.url.startsWith('http') ? image.url : image.url;
    }
    return 'https://via.placeholder.com/400x500?text=No+Image';
  };

  const formatPrice = (product) => {
    // Sales-only marketplace - show sale price
    return `₹${product.price?.sale || product.price || 0}`;
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-neon-500/20 text-neon-700 border-neon-400',
      'Like New': 'bg-coolBlue-100 text-coolBlue-700 border-coolBlue-300',
      'Good': 'bg-mocha-100 text-mocha-700 border-mocha-300',
      'Fair': 'bg-taupe-100 text-taupe-700 border-taupe-300',
    };
    return colors[condition] || 'bg-charcoal-100 text-charcoal-700 border-charcoal-300';
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="card hover:shadow-luxury transition-all duration-300 hover-lift overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden h-72">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Deals Badge - if applicable */}
          {product.discount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="badge badge-sunny shadow-md font-bold">
                💰 {product.discount}% OFF
              </span>
            </div>
          )}
          
          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-sans font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm ${getConditionColor(product.condition)}`}>
              {product.condition}
            </span>
          </div>

          {/* Trust Badge Overlay - appears on hover */}
          {product.verified && (
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <TrustBadge type="ai_authenticated" verified={true} small={true} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-display font-semibold text-lg mb-2 truncate text-charcoal-800 group-hover:text-mocha-600 transition-colors">
            {product.title}
          </h3>
          
          {/* Category & Subcategory */}
          <p className="text-sm text-charcoal-600 mb-3 font-body">
            {product.category}
            {product.subcategory && ` • ${product.subcategory}`}
          </p>
          
          {/* Price & Location */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-mocha-600 font-display font-bold text-2xl">
              {formatPrice(product)}
            </span>
            {product.location?.city && (
              <span className="text-xs text-charcoal-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {product.location.city}
              </span>
            )}
          </div>
          
          {/* Seller Info */}
          {product.seller && (
            <div className="pt-4 border-t border-charcoal-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={product.seller.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.seller.name) + '&background=a47864&color=fff'}
                  alt={product.seller.name}
                  className="w-7 h-7 rounded-full border-2 border-mocha-200"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.seller.name) + '&background=a47864&color=fff';
                  }}
                />
                <span className="text-sm text-charcoal-700 font-sans truncate max-w-[150px]">
                  {product.seller.name}
                </span>
              </div>
              
              {/* Rating if available */}
              {product.seller.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-gold-500 text-sm">⭐</span>
                  <span className="text-xs font-semibold text-charcoal-700">
                    {product.seller.rating}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover Effect Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shimmer" />
      </div>
    </Link>
  );
};

export default ProductCard;
