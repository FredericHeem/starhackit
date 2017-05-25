import React from "react";
import spinner from "./spinner";

export default context => {
  const { tr } = context;
  const Spinner = spinner(context);
  return function SpinnerExamples() {
    return (
      <div>
        <h3>{tr.t("Spinner")}</h3>
        <Spinner />
        <Spinner size={20} />
      </div>
    );
  };
};
