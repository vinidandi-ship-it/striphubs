/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f1a',
        accent: '#a855f7',
        panel: '#1a1a2e',
        border: '#2d2d44'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)'
      }
    }
  },
  plugins: []
};
