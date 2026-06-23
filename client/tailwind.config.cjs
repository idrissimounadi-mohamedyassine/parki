/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#635BFF",
        accent: "#F5F0E8",
        bg: "#FFFFFF",
        text: "#0A0014"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)",
        hover: "0 4px 20px rgba(99,91,255,.15)",
      }
    },
  },
  plugins: [],
}
