/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bajaj: {
          50: '#F0F5FA',
          100: '#E1EDF6',
          200: '#C2DCED',
          300: '#94C1DF',
          400: '#5F9ECB',
          500: '#387EB4',
          600: '#1D6299',
          700: '#0B4F8A',
          800: '#003A6E',
          900: '#002B52',
          navy: '#002547',
          dark: '#001A33'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
