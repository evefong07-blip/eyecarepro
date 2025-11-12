/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        baloo: ["'Baloo 2'", 'cursive'],
      },
      colors: {
        memphis: {
          coral: '#FF6F61',
          purple: '#6B5B95',
          green: '#88B04B',
          pink: '#F7CAC9',
        }
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}
