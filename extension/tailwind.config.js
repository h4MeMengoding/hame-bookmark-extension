/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo': {
          yellow: '#FFE66D',
          pink: '#FF6B9D',
          blue: '#4ECDC4',
          green: '#95E1D3',
          purple: '#C7CEEA',
          orange: '#FFA07A',
          cream: '#FFF9E3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000',
        'brutal-sm': '2px 2px 0px 0px #000',
        'brutal-lg': '6px 6px 0px 0px #000',
      },
    },
  },
  plugins: [],
}
