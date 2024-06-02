import prelinePlugin from "preline/plugin";
import tailwindCssForm from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FFD874",
        btnGold: "#FFA800",
      },
    },
  },
  plugins: [prelinePlugin, tailwindCssForm],
};
