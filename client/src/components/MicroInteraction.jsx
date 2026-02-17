import { useState } from 'react';

/**
 * Micro-Interaction Component
 * Provides haptic-like feedback and smooth animations for user actions
 */
const MicroInteraction = ({ children, type = 'scale', className = '' }) => {
  const getAnimationClass = () => {
    const animations = {
      scale: 'transition-transform duration-200 active:scale-95 hover:scale-105',
      glow: 'transition-shadow duration-300 hover:shadow-glow',
      lift: 'hover-lift',
      shimmer: 'shimmer',
      bounce: 'transition-transform duration-300 hover:animate-bounce',
      pulse: 'animate-pulse',
    };
    return animations[type] || animations.scale;
  };

  return (
    <div className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Loading Skeleton for Better UX
 */
export const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="bg-charcoal-200 h-72 shimmer" />
      <div className="p-5 space-y-3">
        <div className="bg-charcoal-200 h-6 w-3/4 rounded shimmer" />
        <div className="bg-charcoal-200 h-4 w-1/2 rounded shimmer" />
        <div className="flex justify-between">
          <div className="bg-charcoal-200 h-8 w-24 rounded shimmer" />
          <div className="bg-charcoal-200 h-6 w-16 rounded shimmer" />
        </div>
      </div>
    </div>
  );
};

/**
 * Toast Notification Component
 */
export const Toast = ({ message, type = 'success', onClose }) => {
  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-gold-500',
    info: 'bg-coolBlue-500',
  };

  return (
    <div className={`
      fixed bottom-24 md:bottom-8 right-4 z-50 
      ${typeStyles[type]} text-white 
      px-6 py-4 rounded-xl shadow-elevation-3 
      flex items-center gap-3 animate-slide-up
      glass-dark
    `}>
      <span className="text-lg">
        {type === 'success' && '✓'}
        {type === 'error' && '✗'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="font-sans font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:bg-white/20 rounded-full p-1 transition"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * Floating Action Button (FAB)
 */
export const FloatingActionButton = ({ onClick, icon, label, position = 'bottom-right' }) => {
  const positions = {
    'bottom-right': 'bottom-24 md:bottom-8 right-4',
    'bottom-left': 'bottom-24 md:bottom-8 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positions[position]} z-40
        bg-gradient-to-br from-mocha-500 to-gold-500
        text-white p-4 rounded-full shadow-luxury
        hover:shadow-glow transition-all duration-300
        hover:scale-110 active:scale-95
        group
      `}
    >
      <span className="text-2xl">{icon}</span>
      {label && (
        <span className="
          absolute right-full mr-3 top-1/2 -translate-y-1/2
          bg-charcoal-900 text-white px-3 py-2 rounded-lg
          text-sm font-sans whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity
          pointer-events-none
        ">
          {label}
        </span>
      )}
    </button>
  );
};

/**
 * Progress Stepper
 */
export const ProgressStepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center" style={{ flex: index < steps.length - 1 ? 1 : 0 }}>
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
              transition-all duration-300
              ${index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                  ? 'bg-mocha-500 text-white ring-4 ring-mocha-200' 
                  : 'bg-charcoal-200 text-charcoal-500'}
            `}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-2 font-sans text-center">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              h-1 mx-2 transition-all duration-300
              ${index < currentStep ? 'bg-green-500' : 'bg-charcoal-200'}
            `} style={{ flex: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Image Gallery with Lightbox
 */
export const ImageGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <div
          className="col-span-4 md:col-span-3 cursor-pointer rounded-xl overflow-hidden"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[selectedIndex]}
            alt="Main view"
            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="col-span-4 md:col-span-1 grid grid-cols-3 md:grid-cols-1 gap-2">
          {images.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`
                cursor-pointer rounded-lg overflow-hidden
                ${selectedIndex === idx ? 'ring-2 ring-mocha-500' : ''}
              `}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-24 object-cover hover:opacity-75 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-900/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl">✕</button>
          <img
            src={images[selectedIndex]}
            alt="Full size"
            className="max-h-full max-w-full rounded-xl"
          />
        </div>
      )}
    </>
  );
};

export default MicroInteraction;
