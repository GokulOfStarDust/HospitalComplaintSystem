/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'], 
      },
      colors: {
        primary: '#04B7B1', // Twitter blue
        secondary: '#616161',
      },
    },
  },
  plugins: [],
}

