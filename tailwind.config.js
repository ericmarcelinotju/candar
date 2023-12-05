/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
        'primary-dark': '#4970C0',
        primary: '#4B61DD',
        'primary-soft': '#5B7ECDAA',
        'secondary-dark': '#009bde',
        secondary: '#009bde',
        'secondary-soft': '#4ec8f8'
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
