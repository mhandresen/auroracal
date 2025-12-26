import svgToDataUri from "mini-svg-data-uri";
import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import plugin from "tailwindcss/plugin";

const addVariablesForColors = plugin(({ addBase, theme }) => {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({ ":root": newVars });
});

const backgroundPatterns = plugin(({ matchUtilities, theme }) => {
  matchUtilities(
    {
      "bg-grid": (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-grid-small": (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-dot": (value) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" cx="10" cy="10" r="1.6257413380501518"/></svg>`
        )}")`,
      }),
    },
    { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
  );
});

export default {
  // You can leave content out in v4 (auto-detect), but it's fine to keep it explicit:
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2fad55" },
        dark: {
          100: "#0a0a0a",
          200: "#1A1A1A",
          300: "#262626",
          400: "#404040",
          700: "#4D4D4D",
        },
      },
      animation: { shimmer: "shimmer 2s linear infinite" },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [addVariablesForColors, backgroundPatterns],
} satisfies Config;
