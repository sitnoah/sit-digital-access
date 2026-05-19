import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        graphite: "#242424",
        muted: "#6B7280",
        paper: "#F7F7F5",
        line: "#E7E5E1",
        flame: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C"
        }
      },
      boxShadow: {
        soft: "0 22px 70px rgba(17, 17, 17, 0.08)",
        card: "0 16px 40px rgba(17, 17, 17, 0.07)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      backgroundImage: {
        "orange-mesh":
          "radial-gradient(circle at 12% 12%, rgba(249,115,22,0.2), transparent 32%), radial-gradient(circle at 88% 16%, rgba(234,88,12,0.18), transparent 28%), linear-gradient(135deg, #111111 0%, #242424 58%, #3B1D0B 100%)"
      }
    }
  },
  plugins: []
};

export default config;
