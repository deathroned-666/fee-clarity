import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        muted: "#516174",
        paper: "#f7fbff",
        line: "#d7e4ef",
        mint: "#075fc8",
        coral: "#b84a3a",
        amber: "#9d6a00",
        sky: "#0369a1",
        violet: "#5b2eea",
        cyan: "#0ea5e9"
      },
      boxShadow: {
        soft: "0 8px 28px rgba(11, 18, 32, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
