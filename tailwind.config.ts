import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wine: { 950: "#14020a", 900: "#22040e", 800: "#37081a", 700: "#4f0e24", 600: "#6a1530", 500: "#8a1f40" },
        silk: "#f3e6dc",
        champagne: "#d8b98a",
        rose: "#e9b9bd",
      },
      fontFamily: {
        display: ["'Bodoni Moda'", "Georgia", "serif"],
        body: ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
