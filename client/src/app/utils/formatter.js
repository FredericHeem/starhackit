export default (locale = 'en') => {
  return {
    money: (amount, currency) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(amount);
    }
  }
}
