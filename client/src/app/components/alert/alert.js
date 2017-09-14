import * as React from "react";
import glamorous from "glamorous";

export default ({ tr }) => {
  const AlertView = glamorous("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: 'space-between',
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

  const CloseIconView = glamorous("span")({
    cursor: "pointer",
    margin: 10
  });

  function CloseIcon({ onClick }) {
    return (
      <CloseIconView onClick={onClick}>
        {"\u2716"}
      </CloseIconView>
    );
  }
  function createAlert(AlertView) {
    return function Alert({ name, message, code, onRemove, className = 'alert' }) {
      return (
        <AlertView className={className} role="alert">
          <div>
            <h3>
              {tr.t(name)} {code && `(${code})`}
            </h3>
            <p>{`${message}`}</p>
          </div>
          <CloseIcon onClick={onRemove} />
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
