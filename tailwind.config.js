/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#871cf8",
        "background-100": "#1A1F2B",
        "background-200": "#292e3b",
        "background-300": "#56647b",
        "background-400": "#2C3A4F",
      },
    },
  },
  plugins: [],
}