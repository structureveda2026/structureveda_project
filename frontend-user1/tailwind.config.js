/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      colors: {
        "veda-primary": "#ffb357",
        "veda-background": "#fff2d5",
        "veda-text": "#171717",
        "veda-muted": "#6f665b",
      },
      spacing: {
        "auth-section": "600px",
      },
    },
  },
  plugins: [],
};
