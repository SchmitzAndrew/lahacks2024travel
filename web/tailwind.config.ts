import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        text: 'text 4s ease infinite',
        gradient: 'gradient 4s ease infinite',
        'gradient-bg': 'gradient-bg 4s ease infinite',
      },
      keyframes: {
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'gradient-bg': {
          '0%': { 'background-size': '200% 200%', 'background-position': '100% 0' },
          '50%': { 'background-size': '200% 200%', 'background-position': '0 0' },
          '100%': { 'background-size': '200% 200%', 'background-position': '100% 0' },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
export default config;

