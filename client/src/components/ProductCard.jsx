import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const getImageUrl = (image) => {
    if (image?.url) {
      return image.url.startsWith('http') ? image.url : image.url;
    }
    return 'https://via.placeholder.com/300x400?text=No+Image';
  };

  const formatPrice = (product) => {
    if (product.listingType === 'sale' || product.listingType === 'both') {
      return `$${product.price?.sale || 0}`;
    } else if (product.listingType === 'rent') {
      return `$${product.price?.rent?.perDay || 0}/day`;
    }
    return 'Contact seller';
  };

  return (
    <Link to={`/products/${product._id}`} className="card hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.listingType === 'rent' ? 'bg-purple-500 text-white' :
            product.listingType === 'sale' ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {product.listingType === 'rent' ? 'For Rent' :
             product.listingType === 'sale' ? 'For Sale' :
             'Rent/Sale'}
          </span>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-white rounded-full text-xs font-semibold">
            {product.condition}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.category} • {product.subcategory}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary-600 font-bold text-xl">{formatPrice(product)}</span>
          <span className="text-gray-500 text-sm">{product.location?.city || 'Location N/A'}</span>
        </div>
        {product.seller && (
          <div className="mt-3 pt-3 border-t flex items-center">
            <img
              src={product.seller.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.seller.name)}
              alt={product.seller.name}
              className="w-6 h-6 rounded-full mr-2"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.seller.name);
              }}
            />
            <span className="text-sm text-gray-600">{product.seller.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
