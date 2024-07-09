/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // 启用暗色模式
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#9ca3af',
      },
    },
  },
  plugins: [],
}
