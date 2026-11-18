/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vedabg: '#05040B',
        gold: '#F5B82E',
        lightgold: '#FFD978',
        purple: '#7138A8',
        mutedtext: '#C5C2CE',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -15px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        drift: 'drift 30s ease-in-out infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        glowPulse: 'glowPulse 8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
