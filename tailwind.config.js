/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        "primary-h": "#000000",
        bg: "#FFFFFF",
        "bg-soft": "#F5F5F0",
        "border-main": "#2d2d2d",
        "border-light": "#DDDDD8",
        text: "#111111",
        "text-sub": "#3a3a3a",
        "text-muted": "#7a7a72",
      },
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
