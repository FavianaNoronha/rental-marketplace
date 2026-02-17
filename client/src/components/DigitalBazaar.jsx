import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Digital Chudi Bazaar Component
 * Modernizes traditional Indian marketplace with sensory UI
 * Features: Sound cues, live auctions, bargaining
 */
const DigitalBazaar = () => {
  const [liveItems, setLiveItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [offer, setOffer] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulated live auction items - Hybrid: Sale OR Rental auctions
  const mockLiveItems = [
    {
      id: 1,
      title: 'Traditional Silk Saree',
      auctionType: 'sale', // 'sale' or 'rental'
      currentBid: 1200,
      viewers: 45,
      timeLeft: 300, // seconds
      image: 'https://via.placeholder.com/400x500?text=Silk+Saree',
      seller: 'Priya\'s Collection',
      category: 'Traditional Wear',
    },
    {
      id: 2,
      title: 'Gold Plated Jewelry Set',
      auctionType: 'sale',
      currentBid: 850,
      viewers: 32,
      timeLeft: 180,
      image: 'https://via.placeholder.com/400x500?text=Jewelry+Set',
      seller: 'Mira Jewels',
      category: 'Jewelry',
    },
    {
      id: 3,
      title: 'Designer Wedding Lehenga',
      auctionType: 'rental', // Rental auction - bidding on daily rate
      currentBid: 250, // per day
      viewers: 67,
      timeLeft: 450,
      image: 'https://via.placeholder.com/400x500?text=Lehenga',
      seller: 'Ethnic Elegance',
      category: 'Wedding Wear',
      rentalDuration: '3 days',
    },
  ];

  useEffect(() => {
    setLiveItems(mockLiveItems);
  }, []);

  // Sound effect trigger
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    // In a real implementation, this would play actual audio
    const sounds = {
      bid: '🔔 Bid placed!',
      bangles: '🎵 Clink!',
      silk: '✨ Swish!',
      jewel: '💎 Sparkle!',
    };
    
    console.log('Sound:', sounds[type]);
  };

  const handleBargain = (item) => {
    setSelectedItem(item);
    setOffer('');
  };

  const submitOffer = () => {
    if (offer && selectedItem) {
      playSound('bid');
      alert(`Offer of ₹${offer} submitted for ${selectedItem.title}`);
      setSelectedItem(null);
      setOffer('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-mocha-50 via-taupe-50 to-gold-50">
      <div className="container-wide">
        {/* Header with Traditional Aesthetic */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl animate-float">🏪</span>
          </div>
          <h2 className="text-display-md font-serif text-luxury mb-4">
            Digital Chudi Bazaar
          </h2>
          <p className="text-xl text-charcoal-600 font-body max-w-2xl mx-auto">
            Experience the thrill of traditional bazaar shopping with live auctions, 
            real-time bargaining, and sensory delights
          </p>
          <div className="mt-4 flex justify-center items-center gap-4">
            <span className="badge badge-gold animate-pulse">🔴 Live Now</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-ghost text-sm"
            >
              {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </button>
          </div>
        </div>

        {/* Live Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {liveItems.map((item) => (
            <div
              key={item.id}
              className="card-luxury group relative overflow-hidden"
              onMouseEnter={() => playSound('silk')}
            >
              {/* Live Badge */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="badge badge-gold animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </span>
                {/* Auction Type Badge */}
                <span className={`badge ${item.auctionType === 'sale' ? 'badge-mocha' : 'badge-mermaid'}`}>
                  {item.auctionType === 'sale' ? '💰 Sale Auction' : '🔄 Rental Auction'}
                </span>
              </div>

              {/* Viewers */}
              <div className="absolute top-4 right-4 z-10">
                <span className="badge bg-charcoal-900/70 text-white backdrop-blur-sm">
                  👁️ {item.viewers}
                </span>
              </div>

              {/* Image with Shimmer Effect */}
              <div className="relative overflow-hidden h-72">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-serif font-bold text-charcoal-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal-600">{item.category} • {item.seller}</p>
                </div>

                {/* Current Bid */}
                <div className="flex items-center justify-between mb-4 p-4 bg-gold-50 rounded-lg border border-gold-200">
                  <div>
                    <p className="text-xs text-charcoal-600 mb-1">
                      {item.auctionType === 'sale' ? 'Current Bid' : 'Daily Rate Bid'}
                    </p>
                    <p className="text-2xl font-display font-bold text-gold-700">
                      ₹{item.currentBid}{item.auctionType === 'rental' ? '/day' : ''}
                    </p>
                    {item.auctionType === 'rental' && item.rentalDuration && (
                      <p className="text-xs text-charcoal-500 mt-1">
                        Duration: {item.rentalDuration}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-charcoal-600 mb-1">Time Left</p>
                    <p className="text-lg font-mono font-bold text-charcoal-800">
                      {formatTime(item.timeLeft)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSound('bid');
                      alert(`Quick Bid: ₹${item.currentBid + 50}`);
                    }}
                    className="btn btn-primary flex-1"
                  >
                    Quick Bid +₹50
                  </button>
                  <button
                    onClick={() => handleBargain(item)}
                    className="btn btn-outline"
                    title="Make Custom Offer"
                  >
                    💬
                  </button>
                </div>
              </div>

              {/* Hover Effect - Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shimmer" />
            </div>
          ))}
        </div>

        {/* Traditional Market Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-bento p-6 text-center hover-lift sound-cue"
               onMouseEnter={() => playSound('bangles')}>
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-display font-bold mb-2">Live Notifications</h3>
            <p className="text-sm text-charcoal-600">
              Get instant alerts when someone outbids you, just like a real bazaar!
            </p>
          </div>

          <div className="card-bento p-6 text-center hover-lift sound-cue"
               onMouseEnter={() => playSound('silk')}>
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-display font-bold mb-2">Bargaining Chat</h3>
            <p className="text-sm text-charcoal-600">
              Negotiate directly with sellers in real-time, just like the old days!
            </p>
          </div>

          <div className="card-bento p-6 text-center hover-lift sound-cue"
               onMouseEnter={() => playSound('jewel')}>
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-display font-bold mb-2">360° View</h3>
            <p className="text-sm text-charcoal-600">
              Inspect fabrics, drapes, and jewelry details from every angle
            </p>
          </div>
        </div>
      </div>

      {/* Bargain Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-elevation-3 max-w-md w-full p-6">
            <h3 className="text-2xl font-serif mb-4">Make Your Offer</h3>
            <p className="text-charcoal-600 mb-4">
              Current bid: <span className="font-bold text-gold-600">₹{selectedItem.currentBid}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-sans font-semibold mb-2">
                Your Offer (₹)
              </label>
              <input
                type="number"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Enter your offer"
                className="input-luxury"
                min={selectedItem.currentBid + 10}
              />
              <p className="text-xs text-charcoal-500 mt-2">
                Minimum: ₹{selectedItem.currentBid + 10}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={submitOffer}
                disabled={!offer || parseInt(offer) <= selectedItem.currentBid}
                className="btn btn-luxury flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DigitalBazaar;
