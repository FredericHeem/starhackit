import React from "react";
import input from "./input";

export default context => {
  const { tr } = context;
  const InputEmpty = input(context);
  const InputWithValue = input(context);
  const InputDisabled = input(context);
  return function InputExamples() {
    return (
      <div>
        <h3>{tr.t("Input")}</h3>
        <InputEmpty label={tr.t("Input Text Empty")} />
        <InputWithValue defaultValue="something" label={tr.t("Input with value")} />
        <InputDisabled disabled defaultValue="disabled" label={tr.t("Input disabled")} />
      </div>
    );
  };
};
