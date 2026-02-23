/**
 * 2026 Premium Color Palettes
 * Three distinct palettes targeting different demographics
 */

export const colorPalettes = {
  // Mocha Sustainability - Millennials & Gen Z (eco-friendly, authentic)
  mochaSustainability: {
    name: 'Mocha Sustainability',
    primary: {
      mocha: '#A47864',
      warmTaupe: '#C8B8A8',
      sandstone: '#D4C4B0'
    },
    accent: {
      neonGreen: '#7FE7A3',
      mutedPurple: '#9B8EA8',
      earthyOrange: '#D68B6E'
    },
    neutral: {
      offWhite: '#FAF7F4',
      charcoal: '#3A3A3A',
      slate: '#6B6B6B'
    },
    target: ['millennials', 'gen_z'],
    mood: 'authentic, sustainable, grounded'
  },

  // Royal Noir Gold - Boomers & Gen X (heritage, craftsmanship, elite)
  royalNoirGold: {
    name: 'Royal Noir Gold',
    primary: {
      matteBlack: '#1C1C1C',
      softCharcoal: '#3D3D3D',
      deepGray: '#5A5A5A'
    },
    accent: {
      royalGold: '#D9B648',
      champagne: '#F4E4C1',
      bronze: '#CD7F32'
    },
    neutral: {
      cream: '#F9F6F1',
      pearl: '#E8E4DC',
      darkSlate: '#2E2E2E'
    },
    target: ['boomers', 'gen_x'],
    mood: 'heritage, luxury, timeless'
  },

  // Mermaidcore Luxe - Gen Alpha & Beta (fantasy, digital-native)
  mermaidcoreLuxe: {
    name: 'Mermaidcore Luxe',
    primary: {
      iridescentAqua: '#7DD3C0',
      softTeal: '#4A9B8E',
      seafoam: '#C1E7E3'
    },
    accent: {
      pearlescentPurple: '#B39CD0',
      silver: '#C0C0C0',
      holographic: '#E0FFFF'
    },
    neutral: {
      cloudWhite: '#FAFCFC',
      mistyGray: '#D1D9DB',
      deepOcean: '#2C4F54'
    },
    target: ['gen_alpha', 'gen_beta'],
    mood: 'fantasy, immersive, playful'
  }
};

/**
 * Get palette based on user demographics or preferences
 * @param {Object} userProfile - User profile data
 * @returns {Object} Color palette
 */
export const getPaletteForUser = (userProfile) => {
  if (!userProfile) return colorPalettes.mochaSustainability;

  const age = userProfile.age || 25;
  const generation = userProfile.generation;

  // Gen Alpha/Beta (0-15 years) - 2026
  if (generation === 'gen_alpha' || generation === 'gen_beta' || age < 15) {
    return colorPalettes.mermaidcoreLuxe;
  }
  
  // Boomers (60+) and Gen X (44-59)
  if (age >= 44 || generation === 'boomer' || generation === 'gen_x') {
    return colorPalettes.royalNoirGold;
  }
  
  // Millennials (28-43) and Gen Z (16-27) - Default
  return colorPalettes.mochaSustainability;
};

/**
 * Generate CSS variables for selected palette
 * @param {Object} palette - Color palette object
 * @returns {Object} CSS variable object
 */
export const generateCSSVariables = (palette) => {
  return {
    // Primary colors
    '--color-primary-1': palette.primary[Object.keys(palette.primary)[0]],
    '--color-primary-2': palette.primary[Object.keys(palette.primary)[1]],
    '--color-primary-3': palette.primary[Object.keys(palette.primary)[2]],
    
    // Accent colors
    '--color-accent-1': palette.accent[Object.keys(palette.accent)[0]],
    '--color-accent-2': palette.accent[Object.keys(palette.accent)[1]],
    '--color-accent-3': palette.accent[Object.keys(palette.accent)[2]] || palette.accent[Object.keys(palette.accent)[0]],
    
    // Neutral colors
    '--color-neutral-1': palette.neutral[Object.keys(palette.neutral)[0]],
    '--color-neutral-2': palette.neutral[Object.keys(palette.neutral)[1]],
    '--color-neutral-3': palette.neutral[Object.keys(palette.neutral)[2]],
    
    // Semantic colors (derived from palette)
    '--color-background': palette.neutral[Object.keys(palette.neutral)[0]],
    '--color-surface': palette.neutral[Object.keys(palette.neutral)[1]],
    '--color-text-primary': palette.primary[Object.keys(palette.primary)[1]],
    '--color-text-secondary': palette.neutral[Object.keys(palette.neutral)[2]],
    '--color-highlight': palette.accent[Object.keys(palette.accent)[0]]
  };
};

/**
 * Typography scale for universal readability
 */
export const typography = {
  // For Boomers/Gen X - High legibility
  classic: {
    fontFamily: {
      heading: "'Playfair Display', serif",
      body: "'Lato', sans-serif"
    },
    scale: {
      xs: '0.875rem',    // 14px
      sm: '1rem',        // 16px
      base: '1.125rem',  // 18px - Larger for readability
      lg: '1.25rem',     // 20px
      xl: '1.5rem',      // 24px
      '2xl': '2rem',     // 32px
      '3xl': '2.5rem',   // 40px
      '4xl': '3rem'      // 48px
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.6,       // Increased for readability
      relaxed: 1.8
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.05em'
    }
  },

  // For Gen Z/Alpha - Modern, compact
  modern: {
    fontFamily: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    scale: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.75rem',  // 28px
      '3xl': '2.25rem',  // 36px
      '4xl': '3rem'      // 48px
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7
    },
    letterSpacing: {
      tight: '-0.03em',
      normal: '0',
      wide: '0.03em'
    }
  }
};

/**
 * Spacing system based on 8px grid for consistent whitespace
 */
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem'    // 128px
};

/**
 * Touch target sizes for accessibility
 */
export const touchTargets = {
  minimum: '44px',     // WCAG 2.1 minimum
  comfortable: '48px', // Recommended
  large: '56px'        // For older users
};

/**
 * Animation durations for micro-interactions
 */
export const animations = {
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  verySlow: '800ms'
};

/**
 * Z-index scale
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  modal: 1030,
  popover: 1040,
  tooltip: 1050,
  toast: 1060
};

export default {
  colorPalettes,
  getPaletteForUser,
  generateCSSVariables,
  typography,
  spacing,
  touchTargets,
  animations,
  zIndex
};
