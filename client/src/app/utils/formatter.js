export default (locale = 'en') => {
  const dateTimeOptions = {year: 'numeric', month: 'short', day: 'numeric', hour: "numeric", minute: "numeric"};
  let _locale = locale
  return {
    setLocale: (newLocale) => {
        _locale = newLocale
    },
    dateTime: (date) => {
      if(!date) return "";

      return new Intl.DateTimeFormat(_locale, dateTimeOptions).format(new Date(date));
    },
    money: (amount, currency) => {
      return new Intl.NumberFormat(_locale, {
        style: 'currency',
        currency
      }).format(amount);
    }
  }
}
