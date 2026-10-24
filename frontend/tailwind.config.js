/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        // Rotating conic border used by the Raycast-style command bar.
        "border-beam": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Subtle attention pulse for practice nodes.
        "pulse-ring": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.2", transform: "scale(1.25)" },
        },
        // Flowing dash for data-pulse edges (fallback for non-SVG use).
        "dash-flow": {
          to: { "stroke-dashoffset": "-16" },
        },
      },
      animation: {
        "border-beam": "border-beam 4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-in-out infinite",
        "dash-flow": "dash-flow 0.6s linear infinite",
      },
    },
  },
  plugins: [],
};
