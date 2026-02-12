/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",   // Azul
        secondary: "#DC2626", // Rojo
        accent: "#FACC15",    // Amarillo
        light: "#FFFFFF",    // Blanco
        dark: "#000000"      // Negro
      }
    },
  },
  plugins: [],
}
