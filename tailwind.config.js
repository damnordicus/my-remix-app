/** @type {import('tailwindcss').Config} */
export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"], // Ensures Tailwind scans your files
    theme: {
      extend: {
        colors: {
          nord: {
            polarNight: "#2E3440",
            snowStorm: "#ECEFF4",
            frost: "#8FBCBB",
            auroraRed: "#BF616A",
            auroraOrange: "#D08770",
            auroraYellow: "#EBCB8B",
            auroraGreen: "#A3BE8C",
            auroraPurple: "#B48EAD",
          },
        },
      },
    },
    plugins: [],
  };
  