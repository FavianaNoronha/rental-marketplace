require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS - Allow multiple origins for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any origin in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list for production
    if (allowedOrigins.includes(origin) || origin.includes('s3-website') || origin.includes('cloudfront.net')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/kyc', require('./routes/kyc'));
app.use('/api/disputes', require('./routes/disputes'));

// New social & engagement routes
app.use('/api/feed', require('./routes/feed'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/rental-status', require('./routes/rentalStatus'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/social', require('./routes/social'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      mongodb: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handler (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
