/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

export default ({ tr }) => {
  const AlertView = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    margin: 10,
    fontWeight: 500,
    textAlign: "center"
  });

  const AlertDangerView = styled(AlertView)({
    border: "1px solid #ebccd1",
    color: "#a94442",
    backgroundColor: "#f2dede"
  });

  const AlertWarningView = styled(AlertView)({
    border: "1px solid #faebcc",
    color: "#8a6d3b",
    backgroundColor: "#fcf8e3"
  });

  const AlertInfoView = styled(AlertView)({
    border: "1px solid #bce8f1",
    color: "#31708f",
    backgroundColor: "#d9edf7"
  });

  function CloseIcon({ onClick }) {
    return (
      <span
        css={{
          cursor: "pointer",
          margin: 0
        }}
        onClick={onClick}
      >
        {"\u2716"}
      </span>
    );
  }

  function createAlert(AlertView) {
    return function Alert({
      name,
      message,
      code,
      onRemove,
      className = "alert"
    }) {
      return (
        <AlertView className={className} role="alert">
          <div>
            <h3>
              {tr.t(name)} {code && `(${code})`}
            </h3>
            <p>{`${message}`}</p>
          </div>
          {onRemove && <CloseIcon onClick={onRemove} />}
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
