import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Comment = ({ comment, productId, currentUser, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [replyText, setReplyText] = useState('');
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(
        `${API_URL}/comments/${comment._id}`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      comment.text = response.data.data.text;
      comment.edited = true;
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment.');
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

      await axios.post(
        `${API_URL}/comments/${comment._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/comments/${productId}`,
        {
          text: replyText,
          parentComment: comment._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setReplies(prev => [...prev, response.data.data]);
      setReplyText('');
      setShowReplies(true);
      comment.repliesCount = (comment.repliesCount || 0) + 1;
      setLoading(false);
    } catch (error) {
      console.error('Error posting reply:', error);
      setLoading(false);
      alert('Failed to post reply.');
    }
  };

  const loadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/comments/${comment._id}/replies`);
      setReplies(response.data.data);
      setShowReplies(true);
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const isOwner = currentUser && currentUser.id === comment.user?._id;

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <Link to={`/profile/${comment.user?._id}`}>
          <img
            src={comment.user?.avatar || '/default-avatar.png'}
            alt={comment.user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center space-x-2 mb-1">
            <Link
              to={`/profile/${comment.user?._id}`}
              className="font-semibold text-sm text-gray-900 hover:text-indigo-600"
            >
              {comment.user?.name}
            </Link>
            {comment.user?.premium?.isActive && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                PRO
              </span>
            )}
            <span className="text-xs text-gray-500">· {formatDate(comment.createdAt)}</span>
            {comment.edited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="mb-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="2"
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">{comment.text}</p>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500 font-medium' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likesCount > 0 && likesCount}</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-500 hover:text-indigo-600 font-medium"
              >
                Reply
              </button>
            )}

            {comment.repliesCount > 0 && (
              <button
                onClick={loadReplies}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showReplies ? 'Hide' : 'View'} {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this comment?')) {
                      onDelete(comment._id);
                    }
                  }}
                  className="text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Reply Input */}
          {showReplies && currentUser && (
            <div className="mt-3 flex items-start space-x-2">
              <img
                src={currentUser.avatar || '/default-avatar.png'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                />
              </div>
              {replyText.trim() && (
                <button
                  onClick={handleReply}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  {loading ? '...' : 'Post'}
                </button>
              )}
            </div>
          )}

          {/* Replies */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
              {replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  productId={productId}
                  currentUser={currentUser}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
