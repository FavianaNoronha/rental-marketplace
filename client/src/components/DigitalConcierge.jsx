import { useState } from 'react';

/**
 * Digital Concierge Component - Personal Shopping Assistant
 * Modernizes the "Trunk Show" and personal styling experience
 */
const DigitalConcierge = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    occasion: '',
    style: [],
    budget: '',
    size: '',
    colors: [],
  });

  const occasions = [
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'party', label: 'Party', icon: '🎉' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'casual', label: 'Casual', icon: '👕' },
    { value: 'formal', label: 'Formal', icon: '🤵' },
    { value: 'festival', label: 'Festival', icon: '🎊' },
  ];

  const styles = [
    { value: 'traditional', label: 'Traditional', icon: '🪔' },
    { value: 'modern', label: 'Modern', icon: '✨' },
    { value: 'fusion', label: 'Fusion', icon: '🌟' },
    { value: 'minimalist', label: 'Minimalist', icon: '⚪' },
    { value: 'bohemian', label: 'Bohemian', icon: '🌸' },
    { value: 'luxury', label: 'Luxury', icon: '💎' },
  ];

  const colors = [
    { value: 'red', label: 'Red', hex: '#ef4444' },
    { value: 'gold', label: 'Gold', hex: '#f59e0b' },
    { value: 'blue', label: 'Blue', hex: '#3b82f6' },
    { value: 'green', label: 'Green', hex: '#10b981' },
    { value: 'pink', label: 'Pink', hex: '#ec4899' },
    { value: 'black', label: 'Black', hex: '#1f2937' },
    { value: 'white', label: 'White', hex: '#f9fafb' },
    { value: 'purple', label: 'Purple', hex: '#a855f7' },
  ];

  const handleSubmit = () => {
    console.log('Concierge preferences:', preferences);
    // This would trigger AI recommendation engine
    alert('Your personal stylist will curate a collection for you within 24 hours!');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-elevation-3 max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-luxury">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-mocha-500 to-gold-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-display-sm font-serif mb-2">Personal Concierge</h2>
              <p className="text-sm opacity-90">Your personal styling assistant awaits</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {['Occasion', 'Style', 'Preferences'].map((label, idx) => (
              <div key={idx} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${step > idx ? 'bg-mocha-500 text-white' : 'bg-charcoal-200 text-charcoal-600'}
                  transition-all duration-300
                `}>
                  {step > idx ? '✓' : idx + 1}
                </div>
                <span className="ml-2 text-sm hidden sm:inline">{label}</span>
                {idx < 2 && <div className="w-12 h-0.5 bg-charcoal-200 mx-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Occasion */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif mb-4">What's the occasion?</h3>
              <p className="text-charcoal-600 mb-6">Help us understand what you're shopping for</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {occasions.map((occasion) => (
                  <button
                    key={occasion.value}
                    onClick={() => setPreferences({ ...preferences, occasion: occasion.value })}
                    className={`
                      p-6 rounded-xl border-2 transition-all hover-lift text-center
                      ${preferences.occasion === occasion.value 
                        ? 'border-mocha-500 bg-mocha-50 shadow-luxury' 
                        : 'border-charcoal-200 hover:border-mocha-300'}
                    `}
                  >
                    <div className="text-4xl mb-2">{occasion.icon}</div>
                    <div className="font-sans font-semibold">{occasion.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Style Preferences */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif mb-4">What's your style?</h3>
              <p className="text-charcoal-600 mb-6">Select all that apply</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {styles.map((style) => {
                  const isSelected = preferences.style.includes(style.value);
                  return (
                    <button
                      key={style.value}
                      onClick={() => {
                        const newStyles = isSelected
                          ? preferences.style.filter(s => s !== style.value)
                          : [...preferences.style, style.value];
                        setPreferences({ ...preferences, style: newStyles });
                      }}
                      className={`
                        p-6 rounded-xl border-2 transition-all hover-lift text-center
                        ${isSelected
                          ? 'border-mocha-500 bg-mocha-50 shadow-luxury' 
                          : 'border-charcoal-200 hover:border-mocha-300'}
                      `}
                    >
                      <div className="text-4xl mb-2">{style.icon}</div>
                      <div className="font-sans font-semibold">{style.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Final Preferences */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h3 className="text-2xl font-serif mb-4">Final touches</h3>
                <p className="text-charcoal-600 mb-6">Help us personalize your recommendations</p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-sans font-semibold mb-2">Budget Range</label>
                <select
                  value={preferences.budget}
                  onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                  className="input"
                >
                  <option value="">Select budget</option>
                  <option value="under-1000">Under ₹1,000</option>
                  <option value="1000-3000">₹1,000 - ₹3,000</option>
                  <option value="3000-5000">₹3,000 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="above-10000">Above ₹10,000</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-sans font-semibold mb-2">Your Size</label>
                <input
                  type="text"
                  value={preferences.size}
                  onChange={(e) => setPreferences({ ...preferences, size: e.target.value })}
                  placeholder="e.g., S, M, L, XL, 32, 34, etc."
                  className="input"
                />
              </div>

              {/* Favorite Colors */}
              <div>
                <label className="block text-sm font-sans font-semibold mb-2">Favorite Colors</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    const isSelected = preferences.colors.includes(color.value);
                    return (
                      <button
                        key={color.value}
                        onClick={() => {
                          const newColors = isSelected
                            ? preferences.colors.filter(c => c !== color.value)
                            : [...preferences.colors, color.value];
                          setPreferences({ ...preferences, colors: newColors });
                        }}
                        className={`
                          px-4 py-2 rounded-full border-2 transition-all
                          ${isSelected ? 'border-mocha-500 shadow-md scale-110' : 'border-charcoal-300'}
                        `}
                        style={{ 
                          backgroundColor: isSelected ? color.hex + '20' : 'white',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-charcoal-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm font-sans">{color.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
              >
                ← Previous
              </button>
            )}
            <div className="ml-auto flex gap-3">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !preferences.occasion}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn btn-luxury"
                >
                  Get Personalized Recommendations ✨
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalConcierge;
