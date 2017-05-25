import React from "react";
import spinners from "./spinner/spinner.examples";
import alerts from "./alert/alert.examples";
import panels from "./panel/panel.examples";

export default context => {
  const { tr } = context;
  const Spinners = spinners(context);
  const Alerts = alerts(context);
  const Panels = panels(context);
  return function ComponentGuide() {
    return (
      <div>
        <h1>{tr.t("The component guide.")}</h1>
        <h2>{tr.t("A showroom to display components with various properties")}</h2>
        <Alerts />
        <Spinners />
        <Panels />
      </div>
    );
  };
};
