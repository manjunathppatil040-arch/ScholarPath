/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#ccd8cc',
          300: '#a7bfa7',
          400: '#7fa280',
          500: '#5e855f',
          600: '#486b49',
          700: '#3a543b',
          800: '#304431',
          900: '#283829',
          950: '#151e16',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream: {
          50: '#fdfcf9',
          100: '#fbf8f1',
          200: '#f6f0e2',
          300: '#ede2ca',
          400: '#e0cfa9',
          500: '#ceb786',
          600: '#be9f6b',
          700: '#9e7f53',
          800: '#816646',
          900: '#69533a',
          950: '#3a2d1e',
        },
        warmgray: {
          50: '#faf9f8',
          100: '#f4f3f0',
          200: '#e8e6e1',
          300: '#d6d3cb',
          400: '#a8a49a',
          500: '#7e796e',
          600: '#5f5b52',
          700: '#48443e',
          800: '#33312c',
          900: '#1f1e1b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
