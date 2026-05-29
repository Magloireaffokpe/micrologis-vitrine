import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1B5EC2",
          "blue-light": "#2C6BAC",
          "blue-pale": "#EBF2FF",
          orange: "#E85D1A",
          "orange-light": "#FFF3EE",
          dark: "#0D1117",       // Near-black, very tech
          "dark-mid": "#161B22", // GitHub dark mid
          "dark-surface": "#1C2333",
        },
        whatsapp: "#25D366",
        surface: "#F7F9FB",
        border: "#E5E9EF",
      },
      fontFamily: {
        head: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        brand: "6px",       // Sharper — Materiel.net style
        "brand-sm": "4px",
        "brand-lg": "10px",
      },
      boxShadow: {
        brand: "0 1px 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)",
        "brand-hover": "0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        "brand-card": "0 0 0 1px #E5E9EF",
      },
    },
  },
  plugins: [],
};
export default config;
