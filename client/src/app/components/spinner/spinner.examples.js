import * as React from "react";
import paper from "components/Paper";
import spinner from "./spinner";

export default context => {
  const { tr, theme } = context;
  const { palette } = theme;
  const Paper = paper(context);
  const Spinner = spinner(context);
  return function SpinnerExamples() {
    return (
      <Paper>
        <h3>{tr.t("Spinner")}</h3>
        
        <Spinner />
        <Spinner size={30} />
        <Spinner size={40} color={palette.primary} />
        <Spinner size={50} color={palette.secondary} />
      </Paper>
    );
  };
};
