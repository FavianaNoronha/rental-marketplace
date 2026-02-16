import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';

const API_URL = import.meta.env.VITE_API_URL;

const CommentSection = ({ productId, onCommentCountChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [productId, sort]);

  const fetchComments = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/comments/${productId}`, {
        params: { page: pageNum, limit: 10, sort }
      });
      
      if (pageNum === 1) {
        setComments(response.data.data);
      } else {
        setComments(prev => [...prev, ...response.data.data]);
      }
      
      setHasMore(response.data.pagination.hasMore);
      setPage(pageNum);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      
      const response = await axios.post(
        `${API_URL}/comments/${productId}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Add new comment to the top
      setComments(prev => [response.data.data, ...prev]);
      setNewComment('');
      
      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      setSubmitting(false);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setComments(prev => prev.filter(c => c._id !== commentId));
      
      if (onCommentCountChange) {
        onCommentCountChange(comments.length - 1);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  const loadMoreComments = () => {
    if (!loading && hasMore) {
      fetchComments(page + 1);
    }
  };

  return (
    <div className="bg-gray-50 p-4">
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">
          Comments ({comments.length})
        </h4>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex items-start space-x-3">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {newComment.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 text-center">
          <p className="text-gray-600 mb-3">Sign in to leave a comment</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && page === 1 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                productId={productId}
                currentUser={user}
                onDelete={handleDeleteComment}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={loadMoreComments}
                disabled={loading}
                className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load more comments'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
