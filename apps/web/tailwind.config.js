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
          bg: "#0A0D14",
          card: "#121722",
          cardHover: "#1A2232",
          border: "#1E293B",
          primary: "#3B82F6",
          accent: "#6366F1",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          fact: "#10B981",
          inference: "#8B5CF6",
          rule: "#3B82F6",
          contradiction: "#EF4444",
          observation: "#06B6D4",
          unknown: "#64748B"
        }
      }
    },
  },
  plugins: [],
}
