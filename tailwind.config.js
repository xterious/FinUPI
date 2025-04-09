module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00ff7f", // Neon green
          dark: "#00cc66",
          light: "#33ff99",
        },
        secondary: {
          DEFAULT: "#111111", // Almost black
          light: "#333333",
        },
        background: {
          DEFAULT: "#000000",
          light: "#181818",
        },
        text: {
          DEFAULT: "#ffffff",
          muted: "#aaaaaa",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
