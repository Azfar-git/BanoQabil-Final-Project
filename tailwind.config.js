/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        banoBlue: "#2563EB",
        banoPurple: "#7C3AED",
      },
      animation: {
        "bounce-dot": "bounce 1.5s infinite",
      },
    },
  },
  plugins: [],
};
