/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mocha Sophisticate - 2026 Pantone Primary (Trust & Sustainability)
        mocha: {
          50: '#faf7f5',
          100: '#f5ede8',
          200: '#e8d5c9',
          300: '#d4b5a1',
          400: '#bd9580',
          500: '#a47864', // Core Mocha - Pantone 2026
          600: '#8b6352',
          700: '#6f4e41',
          800: '#543c32',
          900: '#3a2a22',
        },
        // Warm Taupe - Supporting Neutral
        taupe: {
          50: '#f9f8f6',
          100: '#f0ede9',
          200: '#ddd6cd',
          300: '#c4b5a6',
          400: '#a99483',
          500: '#8e7766',
          600: '#75614f',
          700: '#5d4d3f',
          800: '#4a3d32',
          900: '#3b3128',
        },
        // Cool Blue Modern - Tech & Professional
        coolBlue: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfe',
          300: '#7cc4fd',
          400: '#36a7fa',
          500: '#0c8ce9', // Confident Blue
          600: '#006fc7',
          700: '#0158a1',
          800: '#064a85',
          900: '#0b3e6e',
        },
        // Icy Blue - Cool Blue Accent
        icyBlue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Golden Luxe - Premium & Ceremonial
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Polished Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Dark Crimson - Golden Luxe Accent
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#5f1212',
        },
        // Mermaidcore - Iridescent Modern
        mermaid: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Pearlescent Purple - Mermaidcore Accent  
        pearl: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Neon Green - Strategic Pop (Gen Z)
        neon: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#b4f34a', // Neon Green Accent
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Muted Purple - Strategic Accent
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#9d84b7', // Muted Purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Charcoal - Dark Mode & Text
        charcoal: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0a0c0e',
        },
      },
      fontFamily: {
        // Neo-Deco Typography System
        serif: ['Playfair Display', 'Georgia', 'serif'], // Primary Headers
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'], // UI/Navigation
        display: ['Montserrat', 'Helvetica', 'sans-serif'], // Secondary Headers
        body: ['Lato', 'system-ui', 'sans-serif'], // Body Copy
      },
      fontSize: {
        // Hierarchical scale
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(164, 120, 100, 0.15)',
        'glow': '0 0 20px rgba(180, 243, 74, 0.3)',
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'elevation-3': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
