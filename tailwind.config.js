/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1100px',
      xl: '1366px',
      '1.5xl': '1440px', // macbooks 13.3 inch
      '2xl': '1536px',
      '4k': '2300px', // 4k
    },

    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },

      fontSize: {
        '10xl': '11rem',
      },

      blur: {
        '10xl': '340px',
      },

      animation: {
        'pulse-slow': 'pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },

      colors: {
        black: {
          background: '#000000',
          'background-hover': '#191C24',
          form: '#1A1A1A',
          'form-border': '#484848',
          'background-purpose': '#12141D',
          'perk-gradient-light': 'rgba(4, 6, 14, 0.9)',
          'perk-gradient-dark': '#04060E',
        },
        gold: {
          dark: '#FA6641',
          light: '#EAE100',
        },
        'my-purple': '#9d34da',
        block: '#1a1a1a',
        'block-hover': '#a6a6a6',
      },
      borderRadius: {
        avatar: '6rem',
      },
      width: {
        chart: '108px',
        time: '95px',
        glass: '107px',
      },
    },
  },
};
