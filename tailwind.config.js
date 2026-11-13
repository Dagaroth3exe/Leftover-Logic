/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        logo: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        paper: "#ECEAE4",
        card: "#F7F6F2",
        ink: "#1C1B19",
        brand: "#FF3131",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        // Cards are "dealt" onto the table and settle at their own --tilt.
        deal: {
          from: { opacity: "0", transform: "translateY(80px) rotate(calc(var(--tilt, 0deg) * -4))" },
          to: { opacity: "1", transform: "translateY(0) rotate(var(--tilt, 0deg))" },
        },
        // Magnets slap onto the fridge door.
        stick: {
          "0%": { opacity: "0", transform: "scale(1.5) rotate(0deg)" },
          "60%": { opacity: "1", transform: "scale(0.94) rotate(var(--tilt, 0deg))" },
          "100%": { opacity: "1", transform: "scale(1) rotate(var(--tilt, 0deg))" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(55%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-in": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "sheet-out": { from: { transform: "translateY(0)" }, to: { transform: "translateY(100%)" } },
        indeterminate: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(300%)" },
        },
        drop: {
          "0%": { opacity: "0", transform: "translateY(-10px) rotate(0deg) scale(1)" },
          "12%": { opacity: "1" },
          "65%": { opacity: "1", transform: "translateY(92px) rotate(160deg) scale(1)" },
          "80%, 100%": { opacity: "0", transform: "translateY(110px) rotate(200deg) scale(0.5)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-out": "fade-out 0.25s ease-in both",
        // `backwards` (not `both`) so hover transforms work once the card has landed.
        deal: "deal 0.75s cubic-bezier(0.2, 0.9, 0.25, 1.1) backwards",
        stick: "stick 0.45s cubic-bezier(0.3, 1.3, 0.5, 1) backwards",
        rise: "rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "sheet-in": "sheet-in 0.45s cubic-bezier(0.2, 0.9, 0.25, 1) both",
        "sheet-out": "sheet-out 0.25s ease-in both",
        indeterminate: "indeterminate 1.3s cubic-bezier(0.6, 0, 0.4, 1) infinite",
        drop: "drop 2.4s cubic-bezier(0.45, 0, 0.7, 1) infinite",
      },
    },
  },
  plugins: [],
};
