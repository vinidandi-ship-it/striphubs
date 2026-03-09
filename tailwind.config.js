/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        accent: '#ff2d75',
        panel: '#141414',
        border: '#27272a'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
};
