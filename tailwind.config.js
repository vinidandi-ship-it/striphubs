/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        accent: '#ff2d75',
        panel: '#151515',
        border: '#2a2a2a'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
};
