/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'], // Asegúrate de que Tailwind procese tus vistas Pug
  theme: {
    extend: {
      colors: {
        mati1: '#000000',
        mati2: '#FFFFFF',
        mati3: '#003366',
        mati4: '#FF6600',
        mati5: '#F5F5DC',
      },
      animation: {
        fadeOut: 'fadeOut 3s forwards',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

