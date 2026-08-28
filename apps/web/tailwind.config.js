/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indra: {
          bg: "#F1F5F9",
          card: "#FFFFFF",
          cardHover: "#F8FAFC",
          border: "#CBD5E1",
          primary: "#0F172A",
          accent: "#EA580C", // Bloomberg Orange
          success: "#059669",
          warning: "#D97706",
          danger: "#DC2626",
          fact: "#059669",
          inference: "#7C3AED",
          rule: "#2563EB",
          contradiction: "#DC2626",
          observation: "#0D9488",
          unknown: "#64748B"
        }
      }
    },
  },
  plugins: [],
}
