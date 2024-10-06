/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#f8f8f8",
        columnBackgroundColor: "#f8f8f8",
      },
    },
  },
  plugins: [],
};
