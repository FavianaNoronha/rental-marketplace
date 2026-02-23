import { useState, useEffect } from 'react';
import api from '../services/api';

const PersonalizationModal = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    categories: [],
    occasions: [],
    sizes: [],
    priceRange: 'all',
    location: ''
  });

  const categories = [
    { id: 'clothes', name: 'Clothes', icon: '👔' },
    { id: 'shoes', name: 'Shoes', icon: '👟' },
    { id: 'jewelry', name: 'Jewelry', icon: '💍' },
    { id: 'accessories', name: 'Accessories', icon: '👜' },
    { id: 'gadgets', name: 'Gadgets', icon: '📱' },
    { id: 'bags', name: 'Bags', icon: '🎒' },
    { id: 'traditional', name: 'Traditional Wear', icon: '🪔' }
  ];

  const occasions = [
    { id: 'wedding', name: 'Weddings', icon: '💒' },
    { id: 'festival', name: 'Festivals', icon: '🎉' },
    { id: 'party', name: 'Parties', icon: '🎊' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'date', name: 'Date Night', icon: '❤️' },
    { id: 'work', name: 'Work/Office', icon: '💼' },
    { id: 'casual', name: 'Casual Daily', icon: '👕' }
  ];

  const sizes = [
    { id: 'xs', name: 'XS' },
    { id: 's', name: 'S' },
    { id: 'm', name: 'M' },
    { id: 'l', name: 'L' },
    { id: 'xl', name: 'XL' },
    { id: 'xxl', name: 'XXL' },
    { id: 'freesize', name: 'Free Size' }
  ];

  const toggleSelection = (type, id) => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id]
    }));
  };

  const handleComplete = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Try to save to backend if user is logged in
      try {
        await api.put('/users/preferences', preferences);
      } catch (error) {
        // Silent fail if not logged in
        console.log('Not logged in, preferences saved locally only');
      }
      
      onComplete(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-mocha-500 to-gold-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold">Personalize Your Experience ✨</h2>
              <p className="text-sm opacity-90 mt-1">Help us show you what you'll love</p>
            </div>
            <button 
              onClick={onSkip}
              className="text-sm underline hover:opacity-80"
            >
              Skip for now
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map(num => (
              <div 
                key={num}
                className={`h-1 flex-1 rounded-full ${
                  num <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">What are you interested in?</h3>
                <p className="text-charcoal-600">Select all that apply</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleSelection('categories', cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.categories.includes(cat.id)
                        ? 'border-mocha-500 bg-mocha-50 shadow-md'
                        : 'border-gray-200 hover:border-mocha-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">What occasions do you dress for?</h3>
                <p className="text-charcoal-600">We'll prioritize these in your feed</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {occasions.map(occ => (
                  <button
                    key={occ.id}
                    onClick={() => toggleSelection('occasions', occ.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.occasions.includes(occ.id)
                        ? 'border-gold-500 bg-gold-50 shadow-md'
                        : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{occ.icon}</div>
                    <div className="text-sm font-medium">{occ.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Your size preferences</h3>
                <p className="text-charcoal-600">We'll filter items to your size</p>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => toggleSelection('sizes', size.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.sizes.includes(size.id)
                        ? 'border-mermaid-500 bg-mermaid-50 shadow-md'
                        : 'border-gray-200 hover:border-mermaid-300'
                    }`}
                  >
                    <div className="text-lg font-bold">{size.name}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your City (for nearby items)</label>
                <input
                  type="text"
                  value={preferences.location}
                  onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mermaid-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget Range</label>
                <select
                  value={preferences.priceRange}
                  onChange={(e) => setPreferences(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mermaid-500 outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Budget Friendly (₹0-500/day)</option>
                  <option value="mid">Mid Range (₹500-2000/day)</option>
                  <option value="premium">Premium (₹2000+/day)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn btn-outline flex-1"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && preferences.categories.length === 0) ||
                (step === 2 && preferences.occasions.length === 0)
              }
              className="btn btn-luxury flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={preferences.sizes.length === 0}
              className="btn btn-luxury flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Setup 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
