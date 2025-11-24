/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Match source files in the root (e.g., App.tsx, index.tsx)
    "./*.{js,ts,jsx,tsx}",
    // Match files in specific directories
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    // Add any other folders where you use Tailwind classes
  ],
theme: {
    extend: {
      // Add keyframes and animation here
      keyframes: {
        'slide-in-top': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'slide-in-top': 'slide-in-top 0.5s ease-out'
      }
    },
  },
  plugins: [],
}