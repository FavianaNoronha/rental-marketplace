import { useState } from 'react';

const FeedFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions = [
    { value: 'popular', label: '🔥 Popular' },
    { value: 'recent', label: '🆕 Recent' },
    { value: 'trending', label: '📈 Trending' },
    { value: 'price_low', label: '💰 Price: Low to High' },
    { value: 'price_high', label: '💸 Price: High to Low' }
  ];

  const categories = [
    'All',
    'Clothes',
    'Shoes',
    'Accessories',
    'Bags',
    'Jewelry',
    'Other'
  ];

  const listingTypes = [
    { value: '', label: 'All' },
    { value: 'rent', label: 'For Rent' },
    { value: 'sale', label: 'For Sale' },
    { value: 'both', label: 'Rent or Buy' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Listing Type */}
        <select
          value={filters.listingType}
          onChange={(e) => onFilterChange({ listingType: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {listingTypes.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* More Filters Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          More Filters
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Active Filters Count */}
        {(filters.category || filters.city) && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
            {[filters.category, filters.city].filter(Boolean).length} active
          </span>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => onFilterChange({ 
                    category: category === 'All' ? '' : category 
                  })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    (category === 'All' && !filters.category) || 
                    filters.category === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Location
            </label>
            <input
              type="text"
              placeholder="City name..."
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Clear Filters */}
          {(filters.category || filters.city || filters.listingType) && (
            <button
              onClick={() => onFilterChange({ 
                category: '', 
                city: '', 
                listingType: '' 
              })}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedFilters;
