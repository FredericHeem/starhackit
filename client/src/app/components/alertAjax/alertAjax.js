import get from "lodash/get";
import React from "react";
import Debug from "debug";
import alert from "../alert";

const debug = new Debug("components:alertAjax");

// A component to display Axios errors

export default context => {
  const Alert = alert(context);

  function AlertAjax({ error, className }) {
    if (!error) {
      return null;
    }
    debug("error:", error);
    const { status } = error.response;
    debug("error status :", status);
    if (![401, 422].includes(status)) {
      return null;
    }
    let message = get(error, "response.data.error.message");
    if (!message) {
      message = error.message;
    }

    return <Alert.Danger className={className} message={message} />;
  }

  return AlertAjax;
};
