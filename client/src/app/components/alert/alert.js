import React from "react";
import glamorous from "glamorous";

export default ({ tr }) => {
  const AlertView = glamorous("div")({
    padding: 20,
    margin: 10,
    fontWeight: 500,
    textAlign: "center"
  });

  const AlertDangerView = glamorous(AlertView)({
    border: "1px solid #ebccd1",
    color: "#a94442",
    backgroundColor: "#f2dede"
  });

  const AlertWarningView = glamorous(AlertView)({
    border: "1px solid #faebcc",
    color: "#8a6d3b",
    backgroundColor: "#fcf8e3"
  });

  const AlertInfoView = glamorous(AlertView)({
    border: "1px solid #bce8f1",
    color: "#31708f",
    backgroundColor: "#d9edf7"
  });

  function createAlert(AlertView) {
    return function Alert({ title, name, message, code }) {
      return (
        <AlertView role="alert">
          {title && <h3>{title}</h3>}
          {name &&
            <div>
              {tr.t("An error occured")}
              <div>{name}</div>
            </div>}
          {message && <div>{tr.t(message)}</div>}
          {code &&
            <div>
              <div>{tr.t("Status Code")}</div>
              <div>{code}</div>
            </div>}
        </AlertView>
      );
    };
  }

  return {
    Danger: createAlert(AlertDangerView),
    Warning: createAlert(AlertWarningView),
    Info: createAlert(AlertInfoView)
  };
};
