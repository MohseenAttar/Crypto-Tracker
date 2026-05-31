/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f0ff",
          100: "#e4e2ff",
          200: "#cdc9ff",
          300: "#b0a8ff",
          400: "#917cff",
          500: "#7c5af6",
          600: "#6c3eed",
          700: "#5c2ed4",
          800: "#4c27ac",
          900: "#3f2388",
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.4s ease both",
        "fade-in":   "fadeIn 0.3s ease both",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulseDot: {
          "0%, 100%": { opacity: 1 },
          "50%":      { opacity: 0.3 },
        },
      },
    },
  },
  plugins: [],
};
