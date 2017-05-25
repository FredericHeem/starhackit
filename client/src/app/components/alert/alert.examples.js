import React from "react";
import alert from "./alert";

export default context => {
  const { tr } = context;
  const Alert = alert(context);
  return function AlertExamples() {
    return (
      <div>
        <h3>{tr.t("Alert")}</h3>
        <Alert type="danger" message="Alert danger" />
        <Alert type="info" message="Alert info" />
      </div>
    );
  };
};
