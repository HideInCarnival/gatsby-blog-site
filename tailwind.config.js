const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class',
  theme: {
    screens: {
      'xs': {'max': '639px'},
      'sm': '640px',
      'md': '760px',
      'lg': '1024px',
      'xl': '1280px'
    },
    textColor: theme => ({
      ...theme('colors'),
      'primary': '#2c3e50',
    }),
    backgroundColor: theme => ({
      ...theme('colors'),
      choosed: '#99a9bf'
    }),
    extend: {
      gridTemplateColumns: {
        'desk': "1fr 1.67fr 5.33fr"
      },
      gridTemplateRows: {
        'mobile-3': "1fr 0fr 4.5fr"
      }
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [
    plugin(({addComponents, theme}) => {
      const container = {
        ".container": {
          "width": "100%",
          "max-width": "1440px"
        },
        // BreakPoints
        "@screen sm": theme("screens.sm"),
        "@screen md": theme("screens.md"),
        "@screen lg": theme("screens.lg"),
        "@screen xl": theme("screens.xl"),
      }
      addComponents(container);
    })
  ],
  corePlugins: {
    container: false
  }
}
