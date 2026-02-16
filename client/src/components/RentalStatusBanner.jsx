import { Link } from 'react-router-dom';

const RentalStatusBanner = ({ rental, productId, compact = false }) => {
  if (!rental) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilAvailable = () => {
    if (!rental.availableFrom) return null;
    const days = Math.ceil((new Date(rental.availableFrom) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Compact version for image overlay
  if (compact) {
    return (
      <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-lg">
        <p className="font-bold text-xs">ON RENT</p>
      </div>
    );
  }

  // Full version
  if (rental.isRented) {
    const daysUntil = getDaysUntilAvailable();
    
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                🔴 ON RENT
              </span>
              {rental.rental?.renter && (
                <span className="text-xs text-gray-600">
                  by {rental.rental.renter.name || rental.rental.renter.username}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Available from:</span>{' '}
                <span className="text-red-600 font-bold">
                  {formatDate(rental.availableFrom)}
                </span>
              </p>
              
              {daysUntil !== null && (
                <p className="text-xs text-gray-600">
                  {daysUntil === 0 ? (
                    <span className="text-green-600 font-semibold">Available today!</span>
                  ) : daysUntil === 1 ? (
                    <span>Available tomorrow</span>
                  ) : (
                    <span>Available in {daysUntil} days</span>
                  )}
                </p>
              )}
            </div>
          </div>

          <Link
            to={`/products/${productId}?tab=calendar`}
            className="ml-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition whitespace-nowrap"
          >
            View Calendar
          </Link>
        </div>

        {/* Waitlist Option */}
        <div className="mt-3 pt-3 border-t border-red-200">
          <Link
            to={`/products/${productId}?action=waitlist`}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Join waitlist to get notified
          </Link>
        </div>
      </div>
    );
  }

  // Available now
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
          ✅ AVAILABLE NOW
        </span>
        <span className="text-sm text-gray-600">Ready to rent!</span>
      </div>
    </div>
  );
};

export default RentalStatusBanner;
