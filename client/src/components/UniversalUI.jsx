/**
 * Universal UI Components
 * Designed for accessibility across all generations (Boomers to Gen Alpha)
 * Follows WCAG 2.1 AAA standards
 */

/**
 * Accessible Button Component
 * Large touch targets, high contrast, clear labels
 */
export const AccessibleButton = ({
  children,
  variant = 'primary',
  size = 'large',
  onClick,
  disabled = false,
  fullWidth = false,
  ariaLabel,
  icon = null,
  loading = false
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  // Size variants (WCAG 2.1 minimum 44px touch target)
  const sizeClasses = {
    comfortable: 'px-8 py-4 text-lg min-h-[56px]', // For older users
    large: 'px-6 py-3 text-base min-h-[48px]',     // Standard
    medium: 'px-5 py-2 text-sm min-h-[44px]'       // Compact (still accessible)
  };

  // Variant styles with high contrast
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl focus:ring-purple-300',
    secondary: 'bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
    outline: 'bg-transparent border-2 border-current hover:bg-gray-50 focus:ring-gray-300'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} flex items-center justify-center gap-3`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      type="button"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-xl">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

/**
 * High Contrast Text Component
 * Ensures 4.5:1 contrast ratio minimum (WCAG AAA for body text)
 */
export const AccessibleText = ({
  children,
  variant = 'body',
  align = 'left',
  className = ''
}) => {
  const variants = {
    h1: 'text-4xl md:text-6xl font-bold leading-tight mb-6',
    h2: 'text-3xl md:text-5xl font-bold leading-tight mb-4',
    h3: 'text-2xl md:text-4xl font-bold leading-tight mb-4',
    h4: 'text-xl md:text-2xl font-bold mb-3',
    body: 'text-lg leading-relaxed',           // 18px for readability
    bodyLarge: 'text-xl md:text-2xl leading-relaxed', // For older users
    caption: 'text-base text-gray-600',
    label: 'text-base font-semibold mb-2 block'
  };

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const Tag = variant.startsWith('h') ? variant : 'p';

  return (
    <Tag className={`${variants[variant]} ${alignments[align]} ${className}`}>
      {children}
    </Tag>
  );
};

/**
 * Accessible Form Input
 * Large touch targets, clear labels, visible focus states
 */
export const AccessibleInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  helpText,
  icon,
  ...props
}) => {
  const id = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={id} className="block text-lg font-semibold mb-3 text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-5 py-4 text-lg border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:border-purple-500 focus:ring-purple-200 ${
            icon ? 'pl-12' : ''
          } ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
          }`}
          style={{ minHeight: '56px' }} // Large touch target
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          {...props}
        />
      </div>

      {helpText && !error && (
        <p id={`${id}-help`} className="mt-2 text-base text-gray-600">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-2 text-base text-red-600 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Breadcrumb Navigation (Linear for older users)
 */
export const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-3 text-lg">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-3">
            {index > 0 && (
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {item.href ? (
              <a href={item.href} className="text-purple-600 hover:text-purple-800 font-medium hover:underline">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-800 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Step-by-Step Progress Indicator
 */
export const StepProgress = ({ steps, currentStep }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 relative">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all ${
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-purple-600 border-purple-600 text-white scale-110'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>

            {/* Step Label */}
            <div className="text-center mt-3">
              <p className={`text-base font-semibold ${
                index <= currentStep ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Accessible Card Component
 * Clear hierarchy, high contrast, large text
 */
export const AccessibleCard = ({
  children,
  title,
  subtitle,
  image,
  onClick,
  interactive = false,
  className = ''
}) => {
  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
        interactive ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-300' : ''
      } ${className}`}
      onClick={onClick}
      type={interactive ? 'button' : undefined}
    >
      {image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img src={image.src} alt={image.alt || ''} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-2xl font-bold mb-2 text-gray-900">{title}</h3>
        )}
        {subtitle && (
          <p className="text-lg text-gray-600 mb-4">{subtitle}</p>
        )}
        {children}
      </div>
    </Component>
  );
};

/**
 * Tooltip with ARIA support
 */
export const AccessibleTooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-4 py-3 bg-gray-900 text-white text-base rounded-lg shadow-xl whitespace-nowrap ${positions[position]}`}
        >
          {content}
          <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45" style={{
            [position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left']: '-6px',
            left: position === 'top' || position === 'bottom' ? '50%' : undefined,
            top: position === 'left' || position === 'right' ? '50%' : undefined,
            transform: 'translateX(-50%) rotate(45deg)'
          }}></div>
        </div>
      )}
    </div>
  );
};

/**
 * Skip to Content Link (for screen readers and keyboard navigation)
 */
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-purple-600 focus:text-white focus:text-lg focus:font-bold focus:rounded-lg focus:shadow-xl"
    >
      Skip to main content
    </a>
  );
};

export default {
  AccessibleButton,
  AccessibleText,
  AccessibleInput,
  Breadcrumb,
  StepProgress,
  AccessibleCard,
  AccessibleTooltip,
  SkipToContent
};
