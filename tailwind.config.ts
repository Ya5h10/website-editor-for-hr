import type { Config } from "tailwindcss";
import { getAllTailwindClassNames } from "./components/framer-editor/tailwindCatalog";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Ensure every catalog utility is available when applied dynamically on the canvas.
  safelist: getAllTailwindClassNames(),
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        framer: {
          bg: "#000000",
          panel: "#111111",
          elevated: "#1a1a1a",
          hover: "#222222",
          active: "#2a2a2a",
          canvas: "#141414",
          border: "#222222",
          blue: "#0099ff",
          muted: "#888888",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;

