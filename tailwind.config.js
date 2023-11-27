/** @type {import('tailwindcss').Config} */
// custom config
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darker: "#152A55",
        dark: "#355797",
        light: "#FBCE00",
        lightFade: "#fbce0022",
        darkerFade: "#152A5555",
        darkFade: "#35579755",
        black: "#000",
        white: "#FFF",
        red: "#f02f12",
        green: "#53ce12",
        blue: "#008ffd",
        transparent: "transparent",
      },
      aspectRatio: {
        "3/1": "3/1.2",
        "3/4": "3/4",
      },
    },
  },
  plugins: [],
};
