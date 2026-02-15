# RentStyle - Rental & Selling Marketplace

A full-featured, production-ready marketplace platform for renting and selling clothes, shoes, and accessories. Built with modern web technologies focusing on user experience, security, and sustainability.

![RentStyle](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Quick Links

- **[Terminal Guide](TERMINAL_GUIDE.md)** - How to use terminals in VS Code and Mac
- **[How to Run Backend & Frontend](HOW_TO_RUN.md)** - Step-by-step guide to run both servers
- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

## 🌟 Features

### User Features
- **Authentication & Authorization**
  - Secure JWT-based authentication
  - User registration and login
  - Password reset functionality
  - Protected routes and role-based access

- **Product Listings**
  - Create listings for rent or sale
  - Multiple image uploads (up to 10 images)
  - Advanced categorization (category, subcategory, condition)
  - Detailed product specifications (brand, size, color, material)
  - Location-based listings

- **Search & Discovery**
  - Advanced search with filters
  - Filter by category, price range, condition, location
  - Sort by newest, price, popularity
  - Real-time search results

- **User Dashboard**
  - Manage all your listings
  - View listing statistics (active, sold, rented)
  - Edit or delete listings
  - Track views and engagement

- **Favorites & Wishlist**
  - Save favorite items
  - Quick access to saved products
  - Easy favorite management

- **User Profiles**
  - Customizable user profiles
  - Rating and review system
  - Location and contact information
  - User verification badges

### Security Features
- **XSS Protection** - Input sanitization and validation
- **CSRF Protection** - Secure form submissions
- **Rate Limiting** - Prevent brute force attacks
- **Helmet.js** - Security headers
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **File Upload Validation** - Type and size restrictions

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Next-generation frontend tooling
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form validation
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting middleware

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v5 or higher)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/FavianaNoronha/rental-marketplace.git
cd rental-marketplace
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# IMPORTANT: Update the following variables:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a secure random string)
# - JWT_REFRESH_SECRET (generate another secure random string)

# Start MongoDB (if running locally)
# For Windows:
mongod

# For Mac/Linux:
sudo service mongod start
```

**Server Environment Variables (.env):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rental-marketplace

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_REFRESH_EXPIRE=30d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install
```

### 4. Running the Application

**Option 1: Run Backend and Frontend Separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

**Option 2: Run Everything (from root directory)**

```bash
# In one terminal for backend
cd server && npm run dev

# In another terminal for frontend
cd client && npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

**Browser Compatibility:**
- ✅ **Recommended:** Chrome, Firefox, Edge
- ⚠️ **Safari:** Works but may require additional configuration (see [TROUBLESHOOTING.md](TROUBLESHOOTING.md))
- Make sure to use `http://` (not `https://`) when accessing localhost

**Having issues?** Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide for common problems and solutions.

## 🎯 Usage Guide

### Creating an Account

1. Click "Sign Up" in the navigation bar
2. Fill in your details (name, email, password)
3. Submit the form
4. You'll be automatically logged in

**Demo Account:**
- Email: `demo@rentstyle.com`
- Password: `demo123`

### Creating a Listing

1. Log in to your account
2. Click "List Item" in the navigation
3. Fill in the product details:
   - Title and description
   - Category and condition
   - Choose "For Sale", "For Rent", or "Both"
   - Set pricing
   - Add product specifications
   - Upload images (up to 10)
   - Set location
4. Click "Create Listing"

### Browsing Products

1. Click "Browse" in the navigation
2. Use filters to narrow down results:
   - Category
   - Price range
   - Condition
   - Location
3. Click on any product to view details

### Managing Your Listings

1. Go to "Dashboard"
2. View all your active, sold, and rented items
3. Edit or delete listings as needed
4. Track views and engagement

## 📁 Project Structure

```
rental-marketplace/
├── client/                 # Frontend React application
│   ├── public/            # Public assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── CreateListing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/      # API services
│   │   │   └── api.js
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                 # Backend Node.js application
│   ├── config/            # Configuration files
│   │   └── database.js
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   ├── error.js
│   │   ├── upload.js
│   │   └── validator.js
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── Message.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── users.js
│   ├── utils/             # Utility functions
│   │   └── jwt.js
│   ├── uploads/           # File uploads directory
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## 🔒 Security Best Practices

This application implements multiple security measures:

1. **Authentication**
   - JWT-based authentication
   - Secure password hashing with bcrypt
   - HTTP-only cookies (configurable)
   - Token expiration and refresh

2. **Input Validation**
   - Server-side validation with express-validator
   - Client-side validation with React Hook Form
   - Sanitization of user inputs

3. **Security Headers**
   - Helmet.js for setting secure HTTP headers
   - CORS configuration
   - Content Security Policy

4. **Rate Limiting**
   - API rate limiting to prevent abuse
   - Configurable limits per endpoint

5. **File Upload Security**
   - File type validation
   - File size limits
   - Secure file storage

## 🧪 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user
PUT    /api/auth/updatedetails     Update user details
PUT    /api/auth/updatepassword    Update password
POST   /api/auth/forgotpassword    Forgot password
PUT    /api/auth/resetpassword/:resettoken  Reset password
```

### Products
```
GET    /api/products               Get all products (with filters)
GET    /api/products/:id           Get single product
POST   /api/products               Create product (auth required)
PUT    /api/products/:id           Update product (auth required)
DELETE /api/products/:id           Delete product (auth required)
GET    /api/products/user/:userId  Get user's products
```

### Users
```
GET    /api/users/:id                      Get user profile
GET    /api/users/favorites/me             Get favorites (auth required)
POST   /api/users/favorites/:productId     Add to favorites (auth required)
DELETE /api/users/favorites/:productId     Remove from favorites (auth required)
```

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach, works on all devices
- **Modern Interface** - Clean, minimal design with Tailwind CSS
- **Smooth Transitions** - Animated interactions and page transitions
- **Loading States** - Clear feedback during data fetching
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback for actions
- **Image Optimization** - Lazy loading and placeholder images
- **Accessibility** - Semantic HTML and ARIA labels

## 🚧 Future Enhancements

- [ ] Real-time messaging between buyers and sellers
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced search with geolocation
- [ ] User reviews and ratings
- [ ] Admin dashboard for content moderation
- [ ] Social media integration
- [ ] PWA support for mobile
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@rentstyle.com or open an issue in the repository.

## 🙏 Acknowledgments

- Inspired by platforms like OLX, OfferUp, and other marketplace solutions
- Built with love for sustainable fashion and circular economy
- Thanks to all contributors and the open-source community

---

**Made with ❤️ by the RentStyle Team**
