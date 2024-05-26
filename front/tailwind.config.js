/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunitos': ["Nunito Sans"]
      },
      colors: {
        primary: '#1E1E2F',
        secondary: '#2C2C3E',
        accent: '#3B3B4F',
      }
    },
  },
  plugins: [],
}
