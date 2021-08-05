import get from "lodash/get";
import React from "react";
import Debug from "debug";
import alert from "mdlean/lib/alert";

const debug = new Debug("components:alertAjax");

// A component to display Axios errors

export default (context) => {
  const Alert = alert(context);

  function AlertAjax({ error, ...other }) {
    if (!error) {
      return null;
    }
    debug("error:", error);
    if (![401, 422].includes(get(error, "response.status"))) {
      return null;
    }

    const message = get(error, "response.data.error.message", error.message);

    return <Alert severity="error" {...other} message={message} />;
  }

  return AlertAjax;
};
