/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        ghost: {
          bg: '#212529',      // Main dark background
          surface: '#2a2e33', // Lighter shade for the card
          accent: '#6c757d',  // Grey text/icons
          text: '#e9ecef',    // Main white text
        }
      },

      boxShadow: {
        'neo-flat': '9px 9px 16px rgba(0,0,0,0.6), -9px -9px 16px rgba(255,255,255, 0.05)',
        'neo-pressed': 'inset 9px 9px 16px rgba(0,0,0,0.6), inset -9px -9px 16px rgba(255,255,255, 0.05)',
      }
    },
  },
  plugins: [],
}