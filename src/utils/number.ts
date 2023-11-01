const roundingTwoDecimal = (value) => {
  if (!value) return 0

  return Math.round(value * 100) / 100
}

const roundingNearestThousand = (value) => {
  if (!value) return 0

  return Math.round(value / 10000) * 10000
}

const isNumber = (value) => {
  if (!value) return

  return !(/\D/.test(value))
}

const convertFromCurrencyToNumber = (value) => {
  if (!value) return

  const result = value.replaceAll('.', '').split('Rp')[1].split(',')[0].trim()

  if (!isNumber(result)) return 0
  return parseInt(result)
}

export {
  roundingTwoDecimal,
  roundingNearestThousand,
  isNumber,
  convertFromCurrencyToNumber
}
