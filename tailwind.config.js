/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
          main: 'rgb(var(--surface-main) / <alpha-value>)',
          card: 'rgb(var(--surface-card) / <alpha-value>)',
          input: 'rgb(var(--surface-input) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
        },
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        accent: {
          light: 'rgb(var(--accent-light) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
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
