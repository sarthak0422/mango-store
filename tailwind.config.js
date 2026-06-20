/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mango: '#F59B1E',
        'mango-dark': '#C97A0A',
        green: '#2D6A4F',
        cream: '#FFFDF5',
        brown: '#3D1C00',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}