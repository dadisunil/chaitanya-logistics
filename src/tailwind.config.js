/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0f1fe',
          200: '#bae3fd',
          300: '#7dcdfb',
          400: '#38b1f6',
          500: '#0e95e9',
          600: '#0277c7',
          700: '#0362a2',
          800: '#065385',
          900: '#0a4570',
          950: '#0F172A',
        },
        accent: {
          50: '#fff8ed',
          100: '#fff0d5',
          200: '#fddcab',
          300: '#fcc177',
          400: '#fa9c3e',
          500: '#f97316',
          600: '#e9530a',
          700: '#c1380c',
          800: '#982e12',
          900: '#7c2813',
          950: '#431007',
        },
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
};