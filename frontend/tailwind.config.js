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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
