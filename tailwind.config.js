/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        pirs: {
          primary: '#2563EB',
          'primary-dark': '#1D4ED8',
          warning: '#F59E0B',
          success: '#10B981',
          danger:  '#EF4444',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'fade-in':    'fadeIn 0.4s ease both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%)',
      },
    },
  },
  plugins: [],
}