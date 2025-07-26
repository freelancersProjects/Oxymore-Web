/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.1)',
        'oxymore': {
          purple: '#500CAD',
          'purple-light': '#8B5CF6',
          blue: '#1593CE',
          'blue-light': '#06B6D4',
          dark: '#0A0A0A',
          'dark-secondary': '#1A1A2E',
          'dark-accent': '#16213E',
          light: '#FFFFFF',
          'light-secondary': '#F3F4F6',
          'light-accent': '#E5E7EB',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
            950: '#030712'
          }
        }
      },
      backgroundImage: {
        'gradient-oxymore': 'linear-gradient(135deg, #500CAD 0%, #1593CE 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%)',
        'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 50%, #E5E7EB 100%)',
        'gradient-purple': 'linear-gradient(135deg, #500CAD 0%, #8B5CF6 100%)',
        'gradient-blue': 'linear-gradient(135deg, #1593CE 0%, #06B6D4 100%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'oxymore': '0 10px 25px -5px rgba(80, 12, 173, 0.3)',
        'oxymore-lg': '0 20px 40px -10px rgba(80, 12, 173, 0.4)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 20px rgba(6, 182, 212, 0.3)'
      }
    },
  },
  plugins: [],
} 
 
 