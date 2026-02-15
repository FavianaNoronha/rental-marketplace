import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-20 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/products" className="btn btn-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
