import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-elevation-2 sticky top-0 z-50 border-b border-charcoal-100">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Logo with 2026 Neo-Deco Style */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-mocha-500 to-gold-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                <div className="relative bg-gradient-to-br from-mocha-500 to-gold-500 p-2 rounded-xl">
                  <span className="text-2xl">♻️</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-luxury leading-none">
                  CircleStyle
                </h1>
                <p className="text-xs text-accent text-mocha-600 leading-none">Circular Fashion</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/products" 
                className="text-charcoal-700 hover:text-mocha-600 transition font-sans font-medium"
              >
                Browse
              </Link>

              {isAuthenticated ? (
                <>
                  <Link 
                    to="/create-listing" 
                    className="text-charcoal-700 hover:text-mocha-600 transition font-sans font-medium"
                  >
                    List Item
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="text-charcoal-700 hover:text-mocha-600 transition font-sans font-medium relative"
                  >
                    Favorites
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-charcoal-700 hover:text-mocha-600 transition font-sans font-medium"
                  >
                    Dashboard
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 hover-lift">
                      <img
                        src={user?.avatar || '/default-avatar.png'}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-mocha-300 shadow-md"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=a47864&color=fff';
                        }}
                      />
                      <span className="text-charcoal-700 font-sans font-medium hidden lg:inline">
                        {user?.name}
                      </span>
                      <svg className="w-4 h-4 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-3 w-56 glass-dark rounded-xl shadow-elevation-3 py-2 hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-white hover:bg-white/10 transition font-sans"
                      >
                        <span className="mr-2">👤</span> Profile
                      </Link>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition font-sans"
                      >
                        <span className="mr-2">🚪</span> Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-charcoal-700 hover:text-mocha-600 transition font-sans font-medium"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-mocha-50 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-charcoal-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-charcoal-200 animate-slide-up">
            <div className="container py-4 space-y-3">
              <Link
                to="/products"
                className="block px-4 py-3 rounded-lg hover:bg-mocha-50 transition font-sans font-medium text-charcoal-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Items
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/create-listing"
                    className="block px-4 py-3 rounded-lg hover:bg-mocha-50 transition font-sans font-medium text-charcoal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    List Item
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-3 rounded-lg hover:bg-mocha-50 transition font-sans font-medium text-charcoal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 rounded-lg hover:bg-mocha-50 transition font-sans font-medium text-charcoal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-lg hover:bg-mocha-50 transition font-sans font-medium text-charcoal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="border-t border-charcoal-200 pt-3">
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-sans font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg hover:bg-mocha-50 transition font-sans font-medium text-charcoal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block btn btn-primary w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Thumb Zone Navigation - Bottom Fixed */}
      {isAuthenticated && (
        <div className="md:hidden thumb-zone flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center gap-1 text-charcoal-600 hover:text-mocha-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-sans">Home</span>
          </Link>
          <Link to="/products" className="flex flex-col items-center gap-1 text-charcoal-600 hover:text-mocha-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs font-sans">Browse</span>
          </Link>
          <Link to="/create-listing" className="flex flex-col items-center gap-1 -mt-8">
            <div className="bg-gradient-to-br from-mocha-500 to-gold-500 p-4 rounded-full shadow-luxury">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-sans text-mocha-600 font-semibold">Add</span>
          </Link>
          <Link to="/favorites" className="flex flex-col items-center gap-1 text-charcoal-600 hover:text-mocha-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-sans">Saved</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-charcoal-600 hover:text-mocha-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-sans">Profile</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
