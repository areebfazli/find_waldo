
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f7ffff", // light orange
        note: "#fff8f2ff",       // super light blue notes
        primary: {
          DEFAULT: "#ff751f",  // amber-500 (yellow/orange)
          foreground: "#1F2937"
        },
        accent: "#ff751f",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backdropBlur: {
        xs: "2px"
      }
    },
  },
  plugins: [],
} satisfies Config
