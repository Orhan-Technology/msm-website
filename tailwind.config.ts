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
        charcoal: "#0E0E10",
        elevated: "#17171A",
        sand: "#F5F5F3",
        white: "#FFFFFF",
        ink: "#18181B",
        mist: "#9A9A9F",
        accent: {
          DEFAULT: "#E2562B",
          hover: "#C8431F",
        },
        line: {
          dark: "rgba(255,255,255,0.08)",
          light: "rgba(0,0,0,0.08)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "8px",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
export default config;
