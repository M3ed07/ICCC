/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      mode: 'jit',
      container: {
        center: true,
        padding: '2rem', // Default padding for the container
        screens: {
          'sm': '100%',        // For small devices like mobile phones and iPad Mini
          'md': '100%',        // For tablets
          'lg': '1024px',      // For laptops
          'xl': '1280px',      // For desktops
          '2xl': '1536px',     // For large desktops
          '3xl': '1920px',     // Custom size for larger screens, such as 1080p TVs
          '4xl': '2560px',     // Custom size for ultra-wide monitors or 4K TVs
        },
      },
      colors: {
        'main':'#fff',
        'Red':'#F95454',
        'Yellow':'#FFEB55',
        'Blue':'#118DF0',
        'darkBg':'#222831',
        'darkRed':'#490300',
        'darkField':'#31363F',
      },
      borderWidth: {'thin':'0.5px' , 'light':'0.1px'},
    },
  },
  plugins: [],
}