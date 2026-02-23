import { useState, useEffect, useRef } from 'react';

/**
 * Scrollytelling Component
 * Interactive storytelling that unfolds as the user scrolls
 * Used for heritage items like Nizami necklaces to showcase history and craftsmanship
 */
const Scrollytelling = ({ story }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (rect.height + viewportHeight)
      ));

      setScrollProgress(progress);

      // Determine current section
      const sectionIndex = Math.floor(progress * story.sections.length);
      setCurrentSection(Math.min(sectionIndex, story.sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [story.sections.length]);

  return (
    <div ref={containerRef} className="relative min-h-screen py-20">
      {/* Fixed Background */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {story.sections.map((section, index) => (
            <ScrollySection
              key={index}
              section={section}
              isActive={currentSection === index}
              progress={currentSection === index ? (scrollProgress * story.sections.length) % 1 : 0}
            />
          ))}
        </div>
      </div>

      {/* Spacer for scroll height */}
      <div style={{ height: `${story.sections.length * 100}vh` }} />
    </div>
  );
};

/**
 * Individual Scrollytelling Section
 */
const ScrollySection = ({ section, isActive, progress }) => {
  const opacity = isActive ? 1 : 0;
  const scale = 1 + (progress * 0.1); // Subtle zoom effect
  const translateY = -progress * 50; // Parallax effect

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-700"
      style={{ 
        opacity,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    >
      {/* Background Image/Video */}
      {section.media && (
        <div 
          className="absolute inset-0"
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          {section.media.type === 'video' ? (
            <video
              src={section.media.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={section.media.url}
              alt={section.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div 
          className="max-w-4xl text-center text-white"
          style={{
            transform: `translateY(${-progress * 30}px)`,
            opacity: 1 - progress,
            transition: 'all 0.3s ease-out'
          }}
        >
          {section.subtitle && (
            <div className="text-sm uppercase tracking-widest mb-4 opacity-80">
              {section.subtitle}
            </div>
          )}
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {section.title}
          </h2>
          
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            {section.description}
          </p>

          {section.stats && (
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              {section.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {section.isFirst && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-center">
            <div className="text-sm mb-2 opacity-80">Scroll to explore</div>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Heritage Item Scrollytelling Template
 * Example: Nizami Necklace Story
 */
export const createHeritageStory = (item) => {
  return {
    sections: [
      {
        isFirst: true,
        media: {
          type: 'image',
          url: item.images?.[0]?.url || '/heritage-item.jpg'
        },
        subtitle: 'Heritage Collection',
        title: item.title,
        description: 'A piece of history, crafted by masters, preserved through generations.'
      },
      {
        media: {
          type: 'image',
          url: item.craftingImage || '/crafting.jpg'
        },
        subtitle: 'The Craft',
        title: 'Handcrafted Excellence',
        description: item.craftingStory || 'Each piece requires 200+ hours of meticulous handwork by skilled artisans. Traditional techniques passed down through five generations.',
        stats: [
          { value: '200+', label: 'Hours of Work' },
          { value: '5', label: 'Generations' },
          { value: '100%', label: 'Handmade' }
        ]
      },
      {
        media: {
          type: 'image',
          url: item.historyImage || '/history.jpg'
        },
        subtitle: 'The History',
        title: 'Nizami Legacy',
        description: item.historyStory || 'Originally worn by the nobility of Hyderabad\'s Nizam court. Each gemstone tells a story of royal celebrations and cultural heritage.',
        stats: [
          { value: '300', label: 'Years Old' },
          { value: '24k', label: 'Gold Purity' },
          { value: '1', label: 'Of a Kind' }
        ]
      },
      {
        media: {
          type: 'image',
          url: item.sustainabilityImage || '/sustainability.jpg'
        },
        subtitle: 'Your Impact',
        title: 'Wear History, Save Future',
        description: 'By renting instead of buying, you\'re preserving heritage while preventing new manufacturing. One rental saves enough water to fill a swimming pool.',
        stats: [
          { value: '2,700L', label: 'Water Saved' },
          { value: '6.5kg', label: 'CO₂ Prevented' },
          { value: '100%', label: 'Authentic' }
        ]
      }
    ]
  };
};

/**
 * Product Detail Scrollytelling Wrapper
 */
export const ProductScrollytelling = ({ product }) => {
  if (!product.isHeritage) return null;

  const story = createHeritageStory(product);

  return (
    <div className="mb-16">
      <Scrollytelling story={story} />
    </div>
  );
};

export default Scrollytelling;
