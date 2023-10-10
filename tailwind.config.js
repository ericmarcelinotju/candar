/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'black-dark': '#1F1F1F',
        black: '#363636',
        'black-soft': '#4A4A4A',
        'grey-dark': '#606060',
        grey: '#DFDFDF',
        'grey-soft': '#F1F1F1',
        'success-dark': '#4EC092',
        success: '#5BCD9F',
        'success-soft': '#5BCD9FAA',
        'warning-dark': '#C0B54E',
        warning: '#CDC25B',
        'warning-soft': '#CDC25BAA',
        'info-dark': '#AFD2FF',
        info: '#C8DFFF',
        'info-soft': '#B8DFFFAA',
        'danger-dark': '#C04F79',
        danger: '#CD5B8A',
        'danger-soft': '#CD5B8AAA',
        'primary-dark': '#4970C0',
        primary: '#5B7ECD',
        'primary-soft': '#5B7ECDAA',
        'secondary-dark': '#3B5D86',
        secondary: '#406C90',
        'secondary-soft': '#406C90AA'
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
