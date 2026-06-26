import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
  ],
  safelist: ["recharts-text"],
  theme: {
    extend: {
      backgroundImage: {
        blogHero: "url('/images/blogHero.webp')",
      },
      colors: {
        primary: {
          "50": "#E8F2FC",
          "100": "#D2E5F9",
          "200": "#A5CCF3",
          "300": "#77B2EE",
          "400": "#4A99E8",
          "500": "#3C91E6",
          "600": "#3C91E6",
          "700": "#114C88",
          "800": "#0C335A",
          "900": "#06192D",
        },
        secondary: {
          "50": "#FFF6E5",
          "100": "#FFEDCC",
          "200": "#FFDB99",
          "300": "#FFC966",
          "400": "#FFB833",
          "500": "#FF7B01",
          "600": "#CC8500",
          "700": "#996300",
          "800": "#664200",
          "900": "#332100",
        },
        background: {
          DEFAULT: "#F0F0F5",
          "50": "#F0F0F5",
          "100": "#E0E1EB",
          "200": "#C1C2D7",
          "300": "#A3A4C2",
          "400": "#8486AE",
          "500": "#28293D",
          "600": "#51537B",
          "700": "#3D3E5C",
          "800": "#1F2034",
          "900": "#14151F",
          "950": "#0A0A0F",
        },
        darkBackground: {
          DEFAULT: "#ffffff",
          "50": "#fafafc",
          "100": "#f3f3f3",
          "200": "#f7f7f7",
          "500": "#444444",
        },
        transparent: "transparent",
        white: "#ffffff",
        persant: "#1CF7FF",
        mid: "#1C1D31",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
