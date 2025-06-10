import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      colors: {
        // Nyika Safaris Brand Colors
        brand: {
          beige: '#F5E6D3',
          navy: '#1A3A4A',
          green: '#4A6B5A',
          'dirty-brown': '#8B5A2B',
          sand: '#D4B78F',
          cream: '#F8F4E9',
        },
        primary: {
          50: '#f8f5f0',
          100: '#f0e9dd',
          200: '#e0d3bb',
          300: '#c9b48e',
          400: '#b38e61',
          500: '#a3784d',
          600: '#8a6141',
          700: '#6f4b36',
          800: '#5d3f31',
          900: '#50372c',
          DEFAULT: '#8B5A2B',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#4A6B5A',
          light: '#5d7e6d',
          dark: '#3a5547',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#F5E6D3',
          foreground: '#1A3A4A',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#1A3A4A',
          light: '#F8F4E9',
        },
        input: '#e5e7eb',
        ring: '#8B5A2B',
        border: '#e5e7eb',
        200: '#E3C5A7',
        300: '#D7AD83',
        400: '#CB955F',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'system-ui', 'serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-sm': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['dark'],
      textColor: ['dark'],
      ringWidth: ['responsive', 'focus-visible', 'disabled', 'focus'],
      ringColor: ['responsive', 'focus-visible', 'disabled', 'focus'],
      ringOffsetWidth: ['responsive', 'focus-visible', 'disabled', 'focus'],
      ringOffsetColor: ['responsive', 'focus-visible', 'disabled', 'focus'],
      pointerEvents: ['responsive', 'hover', 'focus', 'disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
