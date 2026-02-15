import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">RentStyle</h3>
            <p className="text-gray-400">
              Your sustainable fashion marketplace. Rent or sell clothes, shoes, and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="text-gray-400 hover:text-white transition">
                  List an Item
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Clothes" className="text-gray-400 hover:text-white transition">
                  Clothes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Shoes" className="text-gray-400 hover:text-white transition">
                  Shoes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="text-gray-400 hover:text-white transition">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RentStyle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
