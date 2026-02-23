import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatBox = ({ recipientId, recipientName, productId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatPollingRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 3 seconds (simple implementation)
    // In production, use WebSocket (Socket.io) for real-time updates
    chatPollingRef.current = setInterval(() => {
      fetchMessages(true);
    }, 3000);

    return () => {
      if (chatPollingRef.current) {
        clearInterval(chatPollingRef.current);
      }
    };
  }, [recipientId, productId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `/api/chats/${recipientId}?productId=${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      if (!silent) {
        console.error('Failed to fetch messages:', error);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      
      const { data } = await axios.post(
        '/api/chats/send',
        {
          recipient: recipientId,
          product: productId,
          content: newMessage.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold text-lg">{recipientName}</h3>
        <p className="text-sm text-indigo-100">
          {messages.length > 0 && `${messages.length} message${messages.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender === localStorage.getItem('userId');
            
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-indigo-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium
                     hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors"
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Quick reply templates */}
        <div className="flex gap-2 mt-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setNewMessage("Hi! Is this still available?")}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
          >
            Is this available?
          </button>
          <button
            type="button"
            onClick={() => setNewMessage("Can I see more photos?")}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
          >
            More photos?
          </button>
          <button
            type="button"
            onClick={() => setNewMessage("What are the measurements?")}
            className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
          >
            Measurements?
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
