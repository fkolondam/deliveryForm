/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#e3e8f4',
          500: '#1e3a8a',
          600: '#1c3480',
          700: '#172b69',
          800: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}