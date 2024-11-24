/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          10: '#FAFAFA',
          20: '#F5F5F5',
          30: '#EEEEEE',
          40: '#E0E0E0',
          50: '#BDBDBD',
          60: '#9E9E9E',
          70: '#757575',
          80: '#616161',
          90: '#424242',
          100: '#212121'
        },
        offwhite: '#fefefe',
        'black-dark': '#1F1F1F',
        black: '#0d2a36',
        'black-soft': '#4A4A4A',
        'grey-dark': '#606060',
        grey: '#DFDFDF',
        'grey-soft': '#F1F1F1',
        'success-dark': '#4EC092',
        success: '#6ec06e',
        'success-soft': '#c7e6c7',
        'warning-dark': '#DB8000',
        warning: '#DE9400',
        'warning-soft': '#E0AB00',
        'info-dark': '#3289FF',
        info: '#53cff9',
        'info-soft': '#cef1fd',
        'danger-dark': '#C04F79',
        danger: '#ea6153',
        'danger-soft': '#f8c9c4',

        primary: '#008F38',
        'primary-dark': '#00702B',
        'primary-darker': '#00521F',
        'primary-darkest': '#003314',
        'primary-light': '#003314',
        'primary-lighter': '#2DFF7E',
        'primary-lightest': '#7CFFAE',

        secondary: '#419BD9',
        'secondary-dark': '#247DB8',
        'secondary-darker': '#1A5B86',
        'secondary-darkest': '#113954',
        'secondary-light': '#68B1E1',
        'secondary-lighter': '#91C6E9',
        'secondary-lightest': '#BBDCF1'
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio')
  ]
}
