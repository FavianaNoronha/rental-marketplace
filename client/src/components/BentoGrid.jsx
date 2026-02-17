import { Link } from 'react-router-dom';

/**
 * Bento Grid Layout Component - 2026 Modern Dashboard Style
 * Inspired by Apple's dashboard and modern tech interfaces
 */
const BentoGrid = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 ${className}`}>
      {children}
    </div>
  );
};

// Bento Card Component with flexible sizing
export const BentoCard = ({ 
  children, 
  size = 'medium', 
  className = '',
  gradient = false,
  hover = true,
}) => {
  const sizeClasses = {
    small: 'col-span-1 md:col-span-2 lg:col-span-3',
    medium: 'col-span-1 md:col-span-3 lg:col-span-4',
    large: 'col-span-1 md:col-span-4 lg:col-span-6',
    wide: 'col-span-1 md:col-span-6 lg:col-span-8',
    full: 'col-span-1 md:col-span-6 lg:col-span-12',
  };

  const gradientClass = gradient 
    ? 'bg-gradient-to-br from-mocha-50 to-mermaid-50' 
    : 'bg-white';

  return (
    <div 
      className={`
        ${sizeClasses[size]}
        ${gradientClass}
        card-bento p-6
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Hero Bento Card - Large featured section
export const BentoHero = ({ title, description, image, cta, ctaLink, badge }) => {
  return (
    <BentoCard size="large" className="relative overflow-hidden min-h-[400px]">
      {image && (
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
        </div>
      )}
      <div className="relative z-10 h-full flex flex-col justify-end">
        {badge && (
          <span className="badge badge-gold mb-4 w-fit animate-float">
            {badge}
          </span>
        )}
        <h2 className="text-display-md text-luxury mb-4">{title}</h2>
        <p className="text-lg text-charcoal-600 mb-6 font-body">
          {description}
        </p>
        {cta && ctaLink && (
          <Link to={ctaLink} className="btn btn-luxury w-fit">
            {cta}
          </Link>
        )}
      </div>
    </BentoCard>
  );
};

// Stat Card for metrics display
export const BentoStat = ({ label, value, icon, trend, color = 'mocha' }) => {
  const colorClasses = {
    mocha: 'text-mocha-600 bg-mocha-50',
    gold: 'text-gold-600 bg-gold-50',
    mermaid: 'text-mermaid-600 bg-mermaid-50',
    coolBlue: 'text-coolBlue-600 bg-coolBlue-50',
  };

  return (
    <BentoCard size="small" hover={false}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm text-charcoal-500 font-sans mb-1">{label}</p>
      <p className="text-3xl font-display font-bold text-charcoal-800">{value}</p>
    </BentoCard>
  );
};

// Category Card with image
export const BentoCategory = ({ name, icon, image, count, link, color = 'mocha' }) => {
  const colorClasses = {
    mocha: 'from-mocha-500 to-mocha-700',
    gold: 'from-gold-500 to-gold-700',
    mermaid: 'from-mermaid-500 to-mermaid-700',
    coolBlue: 'from-coolBlue-500 to-coolBlue-700',
  };

  return (
    <Link to={link}>
      <BentoCard size="small" className="relative overflow-hidden group">
        {image ? (
          <>
            <img 
              src={image} 
              alt={name}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-70`} />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10`} />
        )}
        <div className="relative z-10 h-full flex flex-col justify-between min-h-[160px]">
          <div className="text-4xl mb-2">{icon}</div>
          <div>
            <h3 className="text-xl font-display font-bold text-charcoal-800 mb-1">
              {name}
            </h3>
            {count && (
              <p className="text-sm text-charcoal-600">{count} items</p>
            )}
          </div>
        </div>
      </BentoCard>
    </Link>
  );
};

// Featured Product Card in Bento style
export const BentoProduct = ({ product, size = 'medium' }) => {
  const getImageUrl = (image) => {
    if (image?.url) {
      return image.url.startsWith('http') ? image.url : image.url;
    }
    return 'https://via.placeholder.com/400x500?text=No+Image';
  };

  const formatPrice = (product) => {
    if (product.listingType === 'sale' || product.listingType === 'both') {
      return `₹${product.price?.sale || 0}`;
    } else if (product.listingType === 'rent') {
      return `₹${product.price?.rent?.perDay || 0}/day`;
    }
    return 'Contact seller';
  };

  return (
    <Link to={`/products/${product._id}`}>
      <BentoCard size={size} className="p-0 group">
        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <span className={`badge ${
              product.listingType === 'rent' ? 'badge-mermaid' :
              product.listingType === 'sale' ? 'badge-gold' :
              'badge-mocha'
            }`}>
              {product.listingType === 'rent' ? 'For Rent' :
               product.listingType === 'sale' ? 'For Sale' :
               'Rent/Sale'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg mb-1 truncate">
            {product.title}
          </h3>
          <p className="text-sm text-charcoal-600 mb-2">
            {product.category} • {product.subcategory}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-mocha-600 font-bold text-xl">
              {formatPrice(product)}
            </span>
            {product.condition && (
              <span className="text-xs text-charcoal-500">
                {product.condition}
              </span>
            )}
          </div>
        </div>
      </BentoCard>
    </Link>
  );
};

export default BentoGrid;
