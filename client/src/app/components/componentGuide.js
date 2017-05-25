import React from "react";
import spinners from "./spinner/spinner.examples";
import alerts from "./alert/alert.examples";
import panels from "./panel/panel.examples";
import inputs from "./input/input.examples";

const h = React.createElement;

export default context => {
  const { tr, parts } = context;
        
  return function ComponentGuide() {
    return (
      <div>
        <h1>{tr.t("The component guide.")}</h1>
        <h2>
          {tr.t("A showroom to display components with various properties")}
        </h2>
        {h(alerts(context))}
        {h(inputs(context))}
        {h(spinners(context))}
        {h(panels(context))}
        {h(parts.auth.containers().login())}
        {h(parts.auth.containers().register())}
        {h(parts.auth.containers().logout())}
        {h(parts.auth.containers().forgot())}
        {h(parts.auth.containers().resetPassword())}
        {h(parts.profile.containers().profile())}
      </div>
    );
  };
};
