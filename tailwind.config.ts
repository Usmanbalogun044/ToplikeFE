import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css", 
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          text: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
        },
      },
      backgroundImage: {
        'hero-gradient': "var(--gradient-hero)",
      },
      // ADD THIS SECTION:
      fontFamily: {
        // This adds the class 'font-brand' that uses your Lobster variable
        brand: ["var(--font-lobster)", "cursive"],
        // This makes 'font-sans' use Inter (optional, but good practice)
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
export default config;