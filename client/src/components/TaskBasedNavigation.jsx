import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Task-Based Navigation Component
 * Myntra-level category recall through life-event based browsing
 * 
 * For Boomers/Gen X: "Where are you going?" (occasion-based)
 * For Gen Z/Alpha: "Vibe Search" (aesthetic-based)
 */

const TaskBasedNavigation = () => {
  const [activeMode, setActiveMode] = useState('occasion'); // 'occasion' or 'vibe'

  // Occasion-based navigation (Boomers & Gen X friendly)
  const occasions = [
    {
      name: 'Wedding',
      icon: '💒',
      description: 'Lehengas, Sherwanis & Traditional Wear',
      link: '/browse?occasion=Wedding',
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      name: 'Vacation',
      icon: '🏖️',
      description: 'Travel Packs, Resort Wear & Beach Outfits',
      link: '/browse?pillar=Safar',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'Office',
      icon: '💼',
      description: 'Power-Casual, Blazers & Formal Wear',
      link: '/browse?occasion=Corporate',
      gradient: 'from-slate-600 to-gray-700'
    },
    {
      name: 'Party',
      icon: '🎉',
      description: 'Cocktail Dresses, Jumpsuits & Statement Pieces',
      link: '/browse?occasion=Party',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Festive',
      icon: '🪔',
      description: 'Anarkalis, Kurta Sets & Ethnic Wear',
      link: '/browse?occasion=Festival',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      name: 'Date Night',
      icon: '❤️',
      description: 'Romantic Dresses & Elegant Outfits',
      link: '/browse?occasion=Date-Night',
      gradient: 'from-red-500 to-rose-600'
    }
  ];

  // Vibe-based navigation (Gen Z & Alpha)
  const vibes = [
    {
      name: 'Mermaidcore',
      icon: '🧜‍♀️',
      colors: ['#7DD3C0', '#B39CD0', '#FFB3D9'],
      description: 'Iridescent, aqua & pearlescent vibes',
      link: '/browse?vibe=Mermaidcore'
    },
    {
      name: 'Neon Gothic',
      icon: '🖤',
      colors: ['#000000', '#FF00FF', '#00FF00'],
      description: 'Dark meets neon maximalism',
      link: '/browse?vibe=Neon-Gothic'
    },
    {
      name: 'Barbiecore',
      icon: '💖',
      colors: ['#FF69B4', '#FFB6D9', '#FFC0CB'],
      description: 'All pink everything',
      link: '/browse?vibe=Barbiecore'
    },
    {
      name: 'Cottagecore',
      icon: '🌸',
      colors: ['#E6CCB2', '#DDB892', '#B08968'],
      description: 'Soft, romantic pastoral aesthetic',
      link: '/browse?vibe=Cottagecore'
    },
    {
      name: 'Dark Academia',
      icon: '📚',
      colors: ['#4A4A4A', '#8B4513', '#2C1810'],
      description: 'Scholarly, vintage, moody',
      link: '/browse?vibe=Dark-Academia'
    },
    {
      name: 'Clean Girl',
      icon: '✨',
      colors: ['#FFFFFF', '#F5F5DC', '#E8E8E8'],
      description: 'Minimal, polished, effortless',
      link: '/browse?vibe=Clean-Girl'
    },
    {
      name: 'Y2K',
      icon: '💿',
      colors: ['#FF1493', '#00CED1', '#9370DB'],
      description: '2000s nostalgia, baby tees, low-rise',
      link: '/browse?vibe=Y2K'
    },
    {
      name: 'Royal',
      icon: '👑',
      colors: ['#D4AF37', '#1C1C1C', '#8B0000'],
      description: 'Regal, luxurious, heritage',
      link: '/browse?vibe=Royal'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-off-white to-sandstone-100">
      <div className="container">
        {/* Header with Mode Toggle */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury mb-4">
            Find Your Perfect Look
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse by occasion or explore trending vibes
          </p>

          {/* Mode Toggle */}
          <div className="inline-flex bg-white rounded-full shadow-lg p-2 gap-2">
            <button
              onClick={() => setActiveMode('occasion')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeMode === 'occasion'
                  ? 'bg-gradient-to-r from-mocha-500 to-gold-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📍 Where are you going?
            </button>
            <button
              onClick={() => setActiveMode('vibe')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeMode === 'vibe'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✨ What's your vibe?
            </button>
          </div>
        </div>

        {/* Occasion-Based Navigation */}
        {activeMode === 'occasion' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {occasions.map((occasion) => (
              <Link
                key={occasion.name}
                to={occasion.link}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${occasion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-6 text-center">
                  <div className="text-5xl mb-3">{occasion.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{occasion.name}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{occasion.description}</p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-mocha-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Vibe-Based Navigation */}
        {activeMode === 'vibe' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {vibes.map((vibe) => (
              <Link
                key={vibe.name}
                to={vibe.link}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Color Palette Preview */}
                <div className="h-3 flex">
                  {vibe.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 transition-all duration-300 group-hover:h-4"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <div className="text-6xl mb-3">{vibe.icon}</div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{vibe.name}</h3>
                  <p className="text-sm text-gray-600 leading-snug">{vibe.description}</p>
                </div>

                {/* Animated Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 rounded-3xl transition-colors duration-300" />
              </Link>
            ))}
          </div>
        )}

        {/* Pro Tip */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 italic">
            💡 <strong>Pro Tip:</strong> Not sure what you need? Try our{' '}
            <Link to="/style-quiz" className="text-mocha-600 underline hover:text-gold-600">
              AI Style Quiz
            </Link>{' '}
            to get personalized recommendations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TaskBasedNavigation;
