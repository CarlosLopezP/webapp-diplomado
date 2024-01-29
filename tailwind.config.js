/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/pages/**/*.jsx", "./src/*.jsx"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

