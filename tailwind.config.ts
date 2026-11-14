import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        enterprise: {
          void: "#01140E",
          deep: "#022C22",
          surface: "#064E3B",
          surfaceCard: "#093D30",
          glass: "rgba(9, 61, 48, 0.65)",
          glassBorder: "rgba(16, 185, 129, 0.25)",
          accent: "#10B981",
          accentHover: "#059669",
          mint: "#A7F3D0",
          gold: "#F59E0B",
          rust: "#EF4444",
          near: "#6366F1",
          textSecondary: "#94A3B8",
        },
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        near: {
          cyan: "#00ec97",
          purple: "#7272ff",
          dark: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        "glow-emerald": "0 0 35px -5px rgba(16, 185, 129, 0.35)",
        "glow-near": "0 0 35px -5px rgba(99, 102, 241, 0.35)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
