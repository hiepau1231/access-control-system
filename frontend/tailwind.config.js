module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da3ff',
          DEFAULT: '#1890ff',
          dark: '#096dd9',
        },
        secondary: {
          light: '#91d5ff',
          DEFAULT: '#69c0ff',
          dark: '#40a9ff',
        },
        success: {
          light: '#b7eb8f',
          DEFAULT: '#52c41a',
          dark: '#389e0d',
        },
        warning: {
          light: '#ffe58f',
          DEFAULT: '#faad14',
          dark: '#d48806',
        },
        error: {
          light: '#ffa39e',
          DEFAULT: '#f5222d',
          dark: '#cf1322',
        },
        gray: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        dark: {
          bg: '#1f2937',
          text: '#f3f4f6',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
