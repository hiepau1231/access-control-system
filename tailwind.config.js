module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color)',
        'success-color': 'var(--success-color)',
        'warning-color': 'var(--warning-color)',
        'error-color': 'var(--error-color)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
