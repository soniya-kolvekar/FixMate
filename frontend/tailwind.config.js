/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2540',
          hover: '#13395F',
          dark: '#061729'
        },
        brandBlue: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF'
        }
      }
    },
  },
  plugins: [],
}
