/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderColor: {
        border: "var(--border)",
      },
      ringColor: {
        ring: "var(--ring)",
      },
      fontFamily: {
        // sans: ['var(--font-dancing)', 'cursive'],
        allura: ["var(--font-allura)", "cursive"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
