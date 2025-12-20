/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#FF00FF', // Fuchsia
          purple: '#4B0082', // Morado profundo (Indigo/Deep Purple) - tweaked to be deeper
          purpleLight: '#bd00ff',
          blue: '#00F0FF', // Azul eléctrico
          green: '#39FF14', // Verde neón
          gold: '#FFD700', // Dorado
        },
        dark: {
          900: '#000000',
          800: '#0a0a0a',
          700: '#151515',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FF00FF' },
          '100%': { boxShadow: '0 0 20px #00FFFF' },
        }
      }
    },
  },
  plugins: [],
}
