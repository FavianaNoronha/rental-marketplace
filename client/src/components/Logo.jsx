import { Link } from 'react-router-dom';

const Logo = ({ showTagline = true, className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Icon: Closet/Hanger with Heart */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-2.5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            {/* Hanger */}
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h7a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h7V5.73A1.98 1.98 0 0 1 10 4a2 2 0 0 1 2-2z" />
            {/* Heart accent */}
            <path d="M7 14c0 2 1 3 2 4l3 3 3-3c1-1 2-2 2-4a2 2 0 0 0-4 0 2 2 0 0 0-4 0z" fill="white" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent leading-none group-hover:scale-105 transition-transform duration-300">
          Closetly
        </h1>
        {showTagline && (
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400 leading-none mt-0.5">
            Your Happy Thrift Shop ✨
          </p>
        )}
      </div>
    </Link>
  );
};

export default Logo;
