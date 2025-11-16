/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ enables manual dark mode control via the 'dark' class
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wraith: {
          dark: "#0a0a0a",
          light: "#f9fafb",
          cyan: "#22d3ee",
        },
      },
    },
  },
  plugins: [],
}
