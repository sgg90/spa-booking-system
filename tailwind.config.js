/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f7f3",
          100: "#e6ede3",
          200: "#cddac6",
          300: "#aec39f",
          400: "#8fa87d",
          500: "#748f61",
          600: "#5b7249",
          700: "#485a3a",
          800: "#3a4830",
          900: "#303b29",
        },
        sand: {
          50: "#fbf8f3",
          100: "#f3ead9",
          200: "#e8d9bd",
          300: "#dac199",
          400: "#c9a672",
          500: "#b98f56",
        },
        ivory: "#faf7f1",
        terracotta: {
          400: "#d99c7c",
          500: "#c67d57",
          600: "#ac6644",
        },
        ink: {
          700: "#3f3d38",
          500: "#6b675f",
          300: "#a39e94",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
