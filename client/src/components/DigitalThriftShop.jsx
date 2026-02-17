import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Digital Thrift Shop Component
 * Inspired by childhood memories of sharing clothes
 * Features: Mystery boxes, donations, swaps, treasure hunting
 */
const DigitalThriftShop = () => {
  const [activeTab, setActiveTab] = useState('browse'); // browse, mystery, swap, donate
  const [selectedSize, setSelectedSize] = useState('all');
  const [treasureFound, setTreasureFound] = useState(0);

  // Simulated thrift shop items with stories
  const thriftItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      price: 150,
      originalPrice: 800,
      image: 'https://via.placeholder.com/300x400?text=Denim+Jacket',
      condition: 'Good',
      size: 'M',
      story: 'My sister wore this throughout college. It has patches from every music festival she attended!',
      donatedBy: 'Priya K.',
      category: 'Outerwear',
      tags: ['vintage', 'denim', 'festival'],
    },
    {
      id: 2,
      title: 'Cotton Floral Dress',
      price: 80,
      originalPrice: 400,
      image: 'https://via.placeholder.com/300x400?text=Floral+Dress',
      condition: 'Like New',
      size: 'S',
      story: 'I wore this to my graduation. Too many memories to let it sit in my closet unused!',
      donatedBy: 'Sneha R.',
      category: 'Dresses',
      tags: ['floral', 'cotton', 'summer'],
    },
    {
      id: 3,
      title: 'Leather Messenger Bag',
      price: 200,
      originalPrice: 1200,
      image: 'https://via.placeholder.com/300x400?text=Messenger+Bag',
      condition: 'Good',
      size: 'One Size',
      story: 'Dad gave this to me when I started my first job. It deserves a new adventure!',
      donatedBy: 'Rahul M.',
      category: 'Accessories',
      tags: ['leather', 'vintage', 'professional'],
    },
    {
      id: 4,
      title: 'Kids Winter Sweater',
      price: 50,
      originalPrice: 300,
      image: 'https://via.placeholder.com/300x400?text=Kids+Sweater',
      condition: 'Good',
      size: '6-8 years',
      story: 'Both my kids wore this. Now it\'s ready to keep another child warm!',
      donatedBy: 'Megha S.',
      category: 'Kids',
      tags: ['kids', 'winter', 'cozy'],
    },
  ];

  // Mystery boxes
  const mysteryBoxes = [
    {
      id: 1,
      name: 'Surprise Summer Bundle',
      price: 199,
      value: 500,
      items: 3,
      category: 'Mixed',
      image: '🎁',
      description: '3 summer essentials from our vintage collection',
    },
    {
      id: 2,
      name: 'Office Ready Mystery',
      price: 299,
      value: 800,
      items: 4,
      category: 'Professional',
      image: '👔',
      description: '4 professional pieces perfect for the workplace',
    },
    {
      id: 3,
      name: 'Kids Treasure Box',
      price: 149,
      value: 400,
      items: 5,
      category: 'Kids',
      image: '🧸',
      description: '5 adorable outfits for growing kids',
    },
  ];

  // Swap opportunities
  const swapItems = [
    {
      id: 1,
      title: 'Blue Kurta Set',
      lookingFor: 'Summer dress or casual top',
      owner: 'Anjali P.',
      image: 'https://via.placeholder.com/300x400?text=Kurta+Set',
      size: 'M',
    },
    {
      id: 2,
      title: 'Formal Blazer',
      lookingFor: 'Casual jacket or denim shirt',
      owner: 'Karthik V.',
      image: 'https://via.placeholder.com/300x400?text=Blazer',
      size: 'L',
    },
  ];

  // Gamification - unlock badges
  const findTreasure = () => {
    setTreasureFound(prev => prev + 1);
    alert('🎉 Treasure Found! You discovered a hidden gem!');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-taupe-50 via-mocha-50 to-icyBlue-50">
      <div className="container-wide">
        {/* Header with Nostalgic Aesthetic */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl animate-float">👚</span>
            <span className="text-6xl animate-float ml-2" style={{ animationDelay: '0.5s' }}>👕</span>
          </div>
          <h2 className="text-display-md font-serif text-luxury mb-4">
            Digital Thrift Shop
          </h2>
          <p className="text-xl text-charcoal-600 font-body max-w-2xl mx-auto mb-6">
            "Something old, something new, something borrowed, something wonderful for you"
            <br />
            <span className="text-sm italic text-charcoal-500 mt-2 block">
              Every piece here has been loved. Now it's ready to create new memories.
            </span>
          </p>

          {/* Treasure Counter */}
          {treasureFound > 0 && (
            <div className="inline-flex items-center gap-2 badge badge-sunny text-base px-6 py-3 animate-bounce">
              🏆 Treasures Found: {treasureFound}
            </div>
          )}

          {/* Frank Sinatra Quote */}
          <div className="mt-8 mx-auto max-w-3xl p-8 glass rounded-2xl border-2 border-mocha-200 shadow-luxury">
            <div className="text-4xl mb-4">🎵</div>
            <blockquote className="text-xl font-serif italic text-charcoal-800 leading-relaxed mb-4">
              "We are only renting what we use while we are alive, 
              because after we are gone, the same things will belong to someone else."
            </blockquote>
            <p className="text-base font-sans text-mocha-600 font-semibold">— Frank Sinatra</p>
            <p className="text-sm text-charcoal-600 mt-4 italic">
              Just like sharing clothes with your sister - every item has a story and deserves a new chapter.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setActiveTab('browse')}
            className={`btn ${activeTab === 'browse' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🛍️ Browse Treasures
          </button>
          <button
            onClick={() => setActiveTab('mystery')}
            className={`btn ${activeTab === 'mystery' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🎁 Mystery Boxes
          </button>
          <button
            onClick={() => setActiveTab('swap')}
            className={`btn ${activeTab === 'swap' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🔄 Swap Corner
          </button>
          <button
            onClick={() => setActiveTab('donate')}
            className={`btn ${activeTab === 'donate' ? 'btn-primary' : 'btn-secondary'}`}
          >
            💝 Donate Items
          </button>
        </div>

        {/* Browse Treasures */}
        {activeTab === 'browse' && (
          <div>
            {/* Size Filter */}
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
              {['all', 'XS', 'S', 'M', 'L', 'XL', 'Kids'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`badge ${selectedSize === size ? 'badge-mocha' : 'badge-taupe'} px-4 py-2 cursor-pointer hover:scale-105 transition-transform`}
                >
                  {size === 'all' ? 'All Sizes' : size}
                </button>
              ))}
            </div>

            {/* Thrift Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {thriftItems.map((item) => (
                <div
                  key={item.id}
                  className="card hover:shadow-luxury transition-all duration-300 hover-lift overflow-hidden group"
                  onClick={Math.random() > 0.7 ? findTreasure : undefined}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Savings Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-gold shadow-md font-bold">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    {/* Condition */}
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-cool text-xs">
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg mb-2 text-charcoal-800">
                      {item.title}
                    </h3>
                    
                    {/* Size & Tags */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="text-xs badge badge-mocha">Size: {item.size}</span>
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs badge badge-taupe">#{tag}</span>
                      ))}
                    </div>

                    {/* Story */}
                    <div className="mb-4 p-3 bg-mocha-50 rounded-lg border border-mocha-200">
                      <p className="text-xs italic text-charcoal-600 line-clamp-2">
                        "{item.story}"
                      </p>
                      <p className="text-xs text-mocha-600 mt-1 font-semibold">
                        — {item.donatedBy}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-display font-bold text-mocha-600">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-charcoal-400 line-through mb-1">
                        ₹{item.originalPrice}
                      </span>
                    </div>

                    {/* CTA */}
                    <button className="btn btn-primary w-full">
                      Adopt This Piece
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mystery Boxes */}
        {activeTab === 'mystery' && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold mb-2">Mystery Boxes 🎁</h3>
              <p className="text-charcoal-600">
                Love surprises? Get a curated bundle at an unbeatable price!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {mysteryBoxes.map((box) => (
                <div
                  key={box.id}
                  className="card-luxury p-8 text-center hover-lift"
                >
                  <div className="text-7xl mb-4">{box.image}</div>
                  <h3 className="text-xl font-display font-bold mb-2">{box.name}</h3>
                  <p className="text-sm text-charcoal-600 mb-4">
                    {box.description}
                  </p>
                  
                  <div className="mb-4">
                    <span className="badge badge-sunny">
                      {box.items} Items • Worth ₹{box.value}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-display font-bold text-coral-600">
                      ₹{box.price}
                    </span>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Save ₹{box.value - box.price}!
                    </p>
                  </div>

                  <button className="btn btn-luxury w-full">
                    🎲 Surprise Me!
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Swap Corner */}
        {activeTab === 'swap' && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold mb-2">Swap Corner 🔄</h3>
              <p className="text-charcoal-600">
                Trade items you don't wear for something fresh. No money needed!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {swapItems.map((item) => (
                <div key={item.id} className="card-bento p-6 hover-lift">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-lg mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-charcoal-600 mb-3">
                        <span className="font-semibold">Looking for:</span> {item.lookingFor}
                      </p>
                      <div className="flex gap-2 mb-4">
                        <span className="badge badge-lavender text-xs">Size {item.size}</span>
                        <span className="badge badge-mint text-xs">By {item.owner}</span>
                      </div>
                      <button className="btn btn-cool">
                        Propose Swap
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/products" className="btn btn-outline">
                + List Your Item for Swap
              </Link>
            </div>
          </div>
        )}

        {/* Donate Section */}
        {activeTab === 'donate' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold mb-2">Donate Your Treasures 💝</h3>
              <p className="text-charcoal-600 mb-6">
                Got clothes you've outgrown? Share them with someone who'll love them next!
              </p>
            </div>

            <div className="card-luxury p-8">
              <div className="space-y-6">
                <div>
                  <label className="block font-sans font-semibold mb-2">What are you donating?</label>
                  <input type="text" placeholder="e.g., Blue denim jacket" className="input" />
                </div>

                <div>
                  <label className="block font-sans font-semibold mb-2">Tell us its story</label>
                  <textarea
                    placeholder="Why is this piece special? Who wore it? What memories does it hold?"
                    className="input min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans font-semibold mb-2">Size</label>
                    <select className="input">
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans font-semibold mb-2">Condition</label>
                    <select className="input">
                      <option>Like New</option>
                      <option>Good</option>
                      <option>Fair</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-sunny-50 rounded-lg border-2 border-dashed border-sunny-300 text-center">
                  <p className="text-sm text-charcoal-600 mb-2">📸 Upload photos</p>
                  <button className="btn btn-secondary">
                    Choose Files
                  </button>
                </div>

                <button className="btn btn-luxury w-full text-lg">
                  💚 Donate & Make Someone's Day
                </button>

                <p className="text-xs text-center text-charcoal-500">
                  Your donation helps someone find joy in preloved fashion. Thank you! 🙏
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Impact Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card-bento p-6 text-center">
            <div className="text-4xl mb-2">👗</div>
            <div className="text-3xl font-display font-bold text-coral-600 mb-1">
              5,234
            </div>
            <p className="text-sm text-charcoal-600">Items Given New Life</p>
          </div>
          <div className="card-bento p-6 text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-display font-bold text-sunny-600 mb-1">
              ₹12L+
            </div>
            <p className="text-sm text-charcoal-600">Saved by Thrifters</p>
          </div>
          <div className="card-bento p-6 text-center">
            <div className="text-4xl mb-2">🌍</div>
            <div className="text-3xl font-display font-bold text-mint-600 mb-1">
              847kg
            </div>
            <p className="text-sm text-charcoal-600">CO₂ Emissions Prevented</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalThriftShop;
