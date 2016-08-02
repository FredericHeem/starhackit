export default (locale = 'en') => {
  const dateTimeOptions = {year: 'numeric', month: 'short', day: 'numeric'};

  return {
    dateTime: (date) => {
      return new Intl.DateTimeFormat(locale, dateTimeOptions).format(new Date(date));
    },
    money: (amount, currency) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(amount);
    }
  }
}
