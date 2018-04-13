import React from "react";
import glamorous from "glamorous-native";
import moment from "moment";

export default (context) => {
  const Text = require("components/Text").default(context);

  const DateView = glamorous(Text)({
  });

  const isPast = date => moment().diff(date) > 0;

  return ({ start_date }) => {
    if (!start_date) return null;
    if (isPast(start_date)) return <DateView>Immediate Start</DateView>;
    return <DateView>Start {moment(start_date).fromNow()}</DateView>;
  };
};
