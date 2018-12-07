export default (locale = "en") => {
  const dateTimeOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };
  let localeCurrent = locale;
  return {
    setLocale: newLocale => {
      localeCurrent = newLocale;
    },
    dateTime: date => {
      if (!date) return "";

      return new Intl.DateTimeFormat(localeCurrent, dateTimeOptions).format(
        new Date(date)
      );
    },
    money: (amount, currency) => new Intl.NumberFormat(localeCurrent, {
        style: "currency",
        currency
      }).format(amount)
  };
};
