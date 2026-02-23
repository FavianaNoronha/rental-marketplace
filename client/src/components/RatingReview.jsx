import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RatingReview = ({ rentalId, productId, recipientId, recipientType, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('rental', rentalId);
      formData.append('product', productId);
      formData.append('reviewee', recipientId);
      formData.append('revieweeType', recipientType); // 'lister' or 'renter'
      formData.append('rating', rating);
      formData.append('comment', review.trim());
      
      photos.forEach((photo, index) => {
        formData.append('photos', photo);
      });

      const { data } = await axios.post(
        '/api/rentals/review',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setReview('');
        setPhotos([]);
        
        if (onSubmitSuccess) {
          onSubmitSuccess(data.data);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Rate Your Experience
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className={`w-10 h-10 ${
                    star <= (hover || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-lg font-semibold text-gray-700">
                {rating === 5 && '⭐ Excellent!'}
                {rating === 4 && '😊 Good'}
                {rating === 3 && '😐 Average'}
                {rating === 2 && '😕 Below Average'}
                {rating === 1 && '😞 Poor'}
              </span>
            )}
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Share your experience... This helps our community!"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {review.length}/500 characters
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          
          <div className="grid grid-cols-5 gap-3 mb-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Review ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            
            {photos.length < 5 && (
              <label className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </label>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            Upload up to 5 photos of the item's condition
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0 || !review.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold
                   hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>

      {/* Review Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          📝 Review Guidelines
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Be honest and constructive</li>
          <li>• Comment on item condition, fit, and overall experience</li>
          <li>• Mention if the lister/renter was responsive and helpful</li>
          <li>• Avoid offensive language or personal attacks</li>
        </ul>
      </div>
    </div>
  );
};

export default RatingReview;
