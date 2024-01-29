/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/views/*.{pug,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};