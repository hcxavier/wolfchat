/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff0f5',
          100: '#ffd6e0',
          200: '#ffbdce',
          300: '#ff94b3',
          400: '#ff5c8d',
          500: '#ff1457',
          600: '#e60042',
          700: '#b30033',
          800: '#90002b',
          900: '#7a0026',
        },
        surface: {
          main: '#2b2c30',
          card: '#35313b',
          input: '#453745',
          hover: '#3e3945',
        },
        accent: {
          light: '#613c4c',
          dark: '#1e1e20',
        }
      },
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'scan': 'scan 2s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        }
    },
  },
  },
  plugins: [],
}
