import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          primary: "#2E7D32",
          primaryLight: "#66BB6A",
          primarySoft: "#A5D6A7",

          secondary: "#4FC3F7",

          accent: "#FFC107",

          background: "#F1F8E9",
          surface: "#FFFFFF",

          textDark: "#1B5E20",
          textLight: "#FAFAFA",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
