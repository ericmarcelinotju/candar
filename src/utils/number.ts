const roundingTwoDecimal = (value) => {
  if (!value) return 0

  return Math.round(value * 100) / 100
}

const isNumber = (value) => {
  if (!value) return

  return !(/\D/.test(value))
}

export {
  roundingTwoDecimal,
  isNumber
}
