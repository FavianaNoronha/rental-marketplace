import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const LikeButton = ({ targetType, targetId, initialLikesCount = 0, onLikeChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfLiked();
  }, [targetId, user]);

  const checkIfLiked = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${API_URL}/likes/user/liked`, {
        params: {
          targetIds: targetId,
          targetType
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const likedMap = response.data.data;
      setIsLiked(likedMap[targetId]?.liked || false);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setIsAnimating(true);
      
      // Optimistic update
      const newIsLiked = !isLiked;
      const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;
      
      setIsLiked(newIsLiked);
      setLikesCount(newCount);
      
      if (onLikeChange) {
        onLikeChange(newCount);
      }

      await axios.post(
        `${API_URL}/likes/${targetType}/${targetId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTimeout(() => setIsAnimating(false), 300);
      setLoading(false);
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(likesCount);
      setLoading(false);
      setIsAnimating(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-1 transition-all ${
        isAnimating ? 'scale-110' : 'scale-100'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLiked ? (
        <svg 
          className="w-6 h-6 text-red-500 fill-current animate-pulse" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ) : (
        <svg 
          className="w-6 h-6 text-gray-700 hover:text-red-500 transition" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
      <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-700'}`}>
        {likesCount}
      </span>
    </button>
  );
};

export default LikeButton;
