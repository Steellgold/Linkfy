/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        pro: {
          100: "#F9B835",
          200: "#DDD7B1",
          300: "#C1942A",
          400: "#A47F25",
          500: "#9A751B",
          600: "#906B11",
          700: "#866107",
          800: "#7C5700",
          900: "#7C5700"
        }
      }
    }
  },
  plugins: []
};