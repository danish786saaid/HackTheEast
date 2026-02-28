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
        oax: {
          navy: "#14345E",
          "navy-light": "#1e4a7a",
          "navy-dark": "#0e2442",
          cream: "#f8f7f4",
          "gray-text": "#4a5568",
          "gray-muted": "#718096",
          accent: "#2b6cb0",
        },
        app: {
          bg: "#0c0a09",
          surface: "#1c1917",
          elevated: "#292524",
          accent: "#ea580c",
          accentLight: "#f97316",
          amber: "#f59e0b",
          safe: "#22c55e",
          warning: "#f59e0b",
          danger: "#ef4444",
          text: "#fafaf9",
          muted: "#a8a29e",
          dim: "#78716c",
          blue: "#3b82f6",
          blueDark: "#2563eb",
          blueLight: "#60a5fa",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
      boxShadow: {
        glass:
          "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 40px rgba(0,0,0,0.3)",
        glassHover:
          "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 40px rgba(0,0,0,0.35), 0 0 60px rgba(234,88,12,0.06)",
        glow: "0 0 40px rgba(234, 88, 12, 0.15)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "oax-content": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
