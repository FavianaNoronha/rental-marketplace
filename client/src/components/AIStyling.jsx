import { useState } from 'react';

/**
 * AI Styling Assistant Component
 * Provides wardrobe analysis, outfit recommendations, and digital closet features
 */
const AIStyling = ({ userCloset = [] }) => {
  const [view, setView] = useState('overview'); // overview, upload, recommendations
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Mock AI-generated outfit recommendations
  const outfitSuggestions = [
    {
      id: 1,
      occasion: 'Office Meeting',
      items: ['White Blazer', 'Black Trousers', 'Leather Shoes'],
      confidence: 92,
      sustainability: 'High',
      image: 'https://via.placeholder.com/300x400?text=Office+Look',
    },
    {
      id: 2,
      occasion: 'Weekend Brunch',
      items: ['Floral Dress', 'Denim Jacket', 'Sneakers'],
      confidence: 88,
      sustainability: 'Medium',
      image: 'https://via.placeholder.com/300x400?text=Casual+Look',
    },
    {
      id: 3,
      occasion: 'Evening Party',
      items: ['Silk Saree', 'Statement Jewelry', 'Heels'],
      confidence: 95,
      sustainability: 'High',
      image: 'https://via.placeholder.com/300x400?text=Party+Look',
    },
  ];

  const wardrobeStats = {
    totalItems: 42,
    utilized: 68, // percentage
    sustainable: 72, // percentage
    avgWearCount: 8,
    carbonSaved: '24 kg',
    moneySpent: '₹45,200',
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnalyzing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        // Simulate AI analysis
        setTimeout(() => {
          setAnalyzing(false);
          alert('AI Analysis Complete! Item identified as: Designer Kurta, Category: Traditional Wear');
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-coolBlue-50 to-mermaid-50 py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl">🤖✨</span>
          </div>
          <h2 className="text-display-md font-serif text-luxury mb-4">
            AI Styling Assistant
          </h2>
          <p className="text-xl text-charcoal-600 font-body max-w-2xl mx-auto">
            Let AI analyze your wardrobe, suggest outfits, and help you make sustainable fashion choices
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-charcoal-300 p-1 bg-white">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'upload', label: 'Upload Item', icon: '📸' },
              { key: 'recommendations', label: 'Outfit Ideas', icon: '✨' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className={`
                  px-6 py-2 rounded-md font-sans font-semibold transition-all
                  ${view === tab.key 
                    ? 'bg-coolBlue-600 text-white shadow-md' 
                    : 'text-charcoal-600 hover:bg-charcoal-50'}
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {view === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Stats Cards */}
            <div className="card-bento p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-coolBlue-100 rounded-lg">
                  <span className="text-3xl">👕</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-charcoal-800">
                    {wardrobeStats.totalItems}
                  </p>
                  <p className="text-sm text-charcoal-600">Total Items</p>
                </div>
              </div>
              <div className="h-2 bg-charcoal-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-coolBlue-600 transition-all duration-500"
                  style={{ width: `${wardrobeStats.utilized}%` }}
                />
              </div>
              <p className="text-xs text-charcoal-600 mt-2">
                {wardrobeStats.utilized}% items actively used
              </p>
            </div>

            <div className="card-bento p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-3xl">🌱</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-green-600">
                    {wardrobeStats.sustainable}%
                  </p>
                  <p className="text-sm text-charcoal-600">Sustainable</p>
                </div>
              </div>
              <p className="text-sm text-charcoal-700 font-semibold">
                Carbon Saved: {wardrobeStats.carbonSaved}
              </p>
              <p className="text-xs text-charcoal-600 mt-1">
                Equivalent to 120 km of driving
              </p>
            </div>

            <div className="card-bento p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gold-100 rounded-lg">
                  <span className="text-3xl">💰</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-gold-600">
                    {wardrobeStats.avgWearCount}x
                  </p>
                  <p className="text-sm text-charcoal-600">Avg. Wear Count</p>
                </div>
              </div>
              <p className="text-sm text-charcoal-700 font-semibold">
                Total Spent: {wardrobeStats.moneySpent}
              </p>
              <p className="text-xs text-charcoal-600 mt-1">
                Cost per wear: ₹135
              </p>
            </div>

            {/* AI Insights */}
            <div className="card-luxury p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                <span>🧠</span> AI Insights & Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-mocha-50 to-transparent rounded-lg border border-mocha-200">
                  <p className="font-sans font-semibold text-sm mb-2">💡 Wardrobe Gap Detected</p>
                  <p className="text-xs text-charcoal-600">
                    You have 3 formal shirts but no matching trousers. Consider renting formal pants for upcoming events.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-transparent rounded-lg border border-green-200">
                  <p className="font-sans font-semibold text-sm mb-2">♻️ Circular Opportunity</p>
                  <p className="text-xs text-charcoal-600">
                    You haven't worn 5 items in 6 months. List them for rent and earn ₹2,400/month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {view === 'upload' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="card-bento p-8">
              <h3 className="text-2xl font-serif font-bold mb-4 text-center">
                Upload to Your Digital Closet
              </h3>
              <p className="text-charcoal-600 mb-6 text-center">
                Our AI will automatically identify the item, suggest category, and add it to your wardrobe
              </p>

              <div className="border-2 border-dashed border-charcoal-300 rounded-xl p-12 text-center hover:border-coolBlue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded item"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      {analyzing && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-coolBlue-600" />
                          <span className="text-sm text-charcoal-600">AI analyzing...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-lg font-sans font-semibold mb-2">
                        Click or drag to upload
                      </p>
                      <p className="text-sm text-charcoal-600">
                        Supports: JPG, PNG, HEIC
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="mt-6 p-4 bg-coolBlue-50 rounded-lg border border-coolBlue-200">
                <p className="text-sm font-sans font-semibold mb-2">✨ Smart Features</p>
                <ul className="text-xs text-charcoal-600 space-y-1">
                  <li>• Auto-detect brand, color, and category</li>
                  <li>• Get instant market value estimate</li>
                  <li>• One-click listing for rent or sale</li>
                  <li>• AI-powered outfit pairing suggestions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {view === 'recommendations' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold mb-2">
                AI-Curated Outfit Combinations
              </h3>
              <p className="text-charcoal-600">
                Based on your wardrobe, upcoming events, and weather forecast
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfitSuggestions.map((outfit) => (
                <div key={outfit.id} className="card-luxury group">
                  <div className="relative overflow-hidden">
                    <img
                      src={outfit.image}
                      alt={outfit.occasion}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-white/90 backdrop-blur-sm text-charcoal-800">
                        {outfit.confidence}% Match
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-serif font-bold mb-3">
                      {outfit.occasion}
                    </h4>
                    <div className="space-y-2 mb-4">
                      {outfit.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 bg-coolBlue-500 rounded-full" />
                          <span className="text-charcoal-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-charcoal-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-charcoal-600">Sustainability:</span>
                        <span className={`badge badge-${
                          outfit.sustainability === 'High' ? 'mocha' : 'gold'
                        }`}>
                          {outfit.sustainability}
                        </span>
                      </div>
                      <button className="btn-icon hover:bg-coolBlue-50">
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="btn btn-cool">
                Generate More Outfits ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStyling;
