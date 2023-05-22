/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColorDark: "#140521",
        mainColor: "#291d30",
        mainColorLight: "#9d61ad",
      },
      screens: {
        xs: "400px",
      },
    },
  },
  plugins: [],
};
