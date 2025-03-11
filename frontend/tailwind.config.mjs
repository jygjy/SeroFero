/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables manual dark mode toggling
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E63946", // Red Variant
        accent: "#F4A8A8",  // Light Pink
        secondary: "#5F3DC4", // Vibrant Blue
        softPurple: "#D5C6F2", // Light Purple
        darkBlue: "#1A1333",  // Dark Blue
        darkGray: "#4C4A6A",  // Dark Grayish Purple
      },
    },
  },
  plugins: [],
};

// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         primary: "#E63946", // Red Variant
//         accent: "#F4A8A8",  // Light Pink
//         secondary: "#5F3DC4", // Vibrant Blue
//         softPurple: "#D5C6F2", // Light Purple
//         darkBlue: "#1A1333",  // Dark Blue
//         darkGray: "#4C4A6A",  // Dark Grayish Purple
//       },
//     },
//   },
//   plugins: [],
// };
