import { Link } from 'react-router-dom';

/**
 * Four Pillars Category Showcase
 * Myntra-level taxonomy for category recall
 * 
 * Pillar 1: Utsav (Festive) - High margin anchor
 * Pillar 2: Safar (Travel) - Frequency driver  
 * Pillar 3: Alankrit (Jewelry) - Completers
 * Pillar 4: Niche-Luxe - Specialized gap market
 */

const FourPillars = () => {
  const pillars = [
    {
      id: 'utsav',
      name: 'Utsav',
      tagline: 'Festive & Occasion',
      description: 'Premium ethnic wear for life\'s most precious moments',
      icon: '🪔',
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
      categories: [
        { name: 'Lehengas', emoji: '👗', count: '2,000+' },
        { name: 'Sherwanis', emoji: '🤵', count: '800+' },
        { name: 'Anarkalis', emoji: '💃', count: '1,500+' },
        { name: 'Structured Drapes', emoji: '🎀', count: '600+' }
      ],
      stats: {
        avgRental: '₹2,999',
        margin: 'HIGH'
      },
      link: '/browse?pillar=Utsav',
      featured: 'Wedding season special: 20% off bridal lehengas'
    },
    {
      id: 'safar',
      name: 'Safar',
      tagline: 'Travel & Western',
      description: 'Curated destination bundles and resort wear for your journeys',
      icon: '✈️',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      categories: [
        { name: 'Destination Bundles', emoji: '🧳', count: '150+' },
        { name: 'Resort Wear', emoji: '🏖️', count: '800+' },
        { name: 'Power-Casual', emoji: '💼', count: '500+' },
        { name: 'Vacation Dresses', emoji: '👗', count: '1,200+' }
      ],
      stats: {
        avgRental: '₹1,499',
        margin: 'FREQUENCY'
      },
      link: '/browse?pillar=Safar',
      featured: 'New: 7-day Goa Beach Pack at ₹4,999'
    },
    {
      id: 'alankrit',
      name: 'Alankrit',
      tagline: 'Jewelry & Adornments',
      description: 'Nizami heritage pieces and contemporary jewelry',
      icon: '💎',
      gradient: 'from-amber-500 via-yellow-500 to-gold-600',
      categories: [
        { name: 'Satladas', emoji: '📿', count: '300+' },
        { name: 'Chandbalis', emoji: '💫', count: '600+' },
        { name: 'Lab-Grown Diamonds', emoji: '💍', count: '200+' },
        { name: 'Temple Jewelry', emoji: '🕉️', count: '400+' }
      ],
      stats: {
        avgRental: '₹3,499',
        margin: 'PREMIUM'
      },
      link: '/browse?pillar=Alankrit',
      featured: '200-year-old Nizami necklace now available'
    },
    {
      id: 'niche-luxe',
      name: 'Niche-Luxe',
      tagline: 'Inclusive & Specialty',
      description: 'Capturing the missing middle - luxury for every body',
      icon: '🌟',
      gradient: 'from-purple-500 via-violet-500 to-indigo-600',
      categories: [
        { name: 'Maternity Luxe', emoji: '🤰', count: '300+' },
        { name: 'Plus-Size Premium', emoji: '👕', count: '600+' },
        { name: 'Luxury Bags', emoji: '👜', count: '400+' },
        { name: 'Designer Handbags', emoji: '👛', count: '250+' }
      ],
      stats: {
        avgRental: '₹2,199',
        margin: 'SPECIALIZED'
      },
      link: '/browse?pillar=Niche-Luxe',
      featured: 'New: Prada & Burberry bags collection'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From wedding season to vacation mode, find your perfect look in our expertly curated collections
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {pillars.map((pillar, index) => (
            <Link
              key={pillar.id}
              to={pillar.link}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-6xl">{pillar.icon}</span>
                      <div>
                        <h3 className="text-3xl font-serif font-bold text-gray-900">
                          {pillar.name}
                        </h3>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mt-3">
                      {pillar.description}
                    </p>
                  </div>
                  
                  {/* Stats Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                      {pillar.stats.margin}
                    </div>
                    <div className="text-2xl font-bold text-mocha-600">
                      {pillar.stats.avgRental}
                    </div>
                    <div className="text-xs text-gray-500">avg. rental</div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {pillar.categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors duration-300"
                    >
                      <span className="text-2xl">{category.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500">{category.count}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Featured Banner */}
                <div className={`p-4 rounded-xl bg-gradient-to-r ${pillar.gradient} text-white`}>
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    {pillar.featured}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <svg className="w-8 h-8 text-mocha-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Completers Section */}
        <div className="bg-gradient-to-br from-charcoal-900 to-mocha-900 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Complete Your Look
              </h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                In India, shoes and jewelry aren't extras—they're essentials. Discover our curated collection of footwear and accessories to perfect every outfit.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold">
                  👡 Mojaris & Juttis
                </span>
                <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold">
                  👠 Designer Heels
                </span>
                <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold">
                  👟 Luxury Sneakers
                </span>
                <span className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold">
                  👜 Clutches
                </span>
              </div>
              <Link
                to="/browse?pillar=Completers"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold rounded-full hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-fit"
              >
                Browse Completers
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {/* Visual Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 flex items-center justify-center text-7xl">
                👡
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-7xl">
                👠
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-7xl">
                👟
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-7xl">
                👜
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-12 text-center p-6 bg-mocha-50 rounded-2xl border border-mocha-200">
          <p className="text-gray-700">
            <span className="font-bold text-mocha-600">💡 Category Expert Tip:</span>{' '}
            <span className="italic">
              "Utsav" drives rental value, "Safar" drives frequency, "Alankrit" drives premium perception, 
              and "Niche-Luxe" captures the underserved market. Together, they create a life-event companion, 
              not just a rental platform.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FourPillars;
