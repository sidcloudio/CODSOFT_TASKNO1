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
        dark: {
          bg: '#070a13',
          card: 'rgba(15, 22, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.06)',
          accent: '#0f172a'
        },
        neo: {
          cyan: '#06b6d4',
          indigo: '#6366f1',
          purple: '#a855f7',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.15)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
