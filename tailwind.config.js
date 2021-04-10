const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        indigo: colors.indigo
      },
      fontSize: {
        lg: ["1.125rem", "1.5625rem"]
      }
    }
  },
  variants: {
    extend: {}
  }
};
