export default (locale = "en") => {
  const dateTimeOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };
  let _locale = locale;
  return {
    setLocale: newLocale => {
      _locale = newLocale;
    },
    dateTime: date => {
      if (!date) return "";

      return new Intl.DateTimeFormat(_locale, dateTimeOptions).format(
        new Date(date)
      );
    },
    money: amount => {
      if (amount) {
        const { value, currency } = amount;
        return `${value}  ${currency}`;
      }
      return "";
    },
    currency: (value, currency) => {
      if (value) {
        return `${value}  ${currency}`;
      }
      return "";
    },

    money1: ({ value, currency }) =>
      new Intl.NumberFormat(_locale, {
        style: "currency",
        currency
      }).format(value)
  };
};
