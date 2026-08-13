/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF5EC',
          200: '#F3E9D2',
          300: '#EBDBB8',
        },
        saffron: {
          50: '#FFF8F0',
          100: '#FFE9D6',
          200: '#FFD2A8',
          300: '#FFB570',
          400: '#FF9442',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        gold: {
          400: '#D4AF37',
          500: '#C19A2B',
          600: '#A07C1F',
        },
        purple: {
          50: '#F8F5FB',
          100: '#EDE3F2',
          200: '#D9C7E3',
          300: '#B89DCA',
          400: '#9670AC',
          500: '#7A4F8E',
          600: '#5F3A75',
          700: '#4A2C5C',
          800: '#3A2150',
          900: '#2D1940',
        },
        charcoal: {
          50: '#F5F4F2',
          100: '#E8E5E0',
          200: '#C9C3B9',
          300: '#A39B8E',
          400: '#7A6F5F',
          500: '#5C5145',
          600: '#463D34',
          700: '#362F28',
          800: '#272219',
          900: '#1A1611',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(60, 45, 30, 0.06), 0 1px 2px rgba(60, 45, 30, 0.04)',
        card: '0 2px 8px rgba(60, 45, 30, 0.06), 0 1px 2px rgba(60, 45, 30, 0.04)',
        elevated: '0 8px 24px rgba(60, 45, 30, 0.08), 0 2px 6px rgba(60, 45, 30, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
