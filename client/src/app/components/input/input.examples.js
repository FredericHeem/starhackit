import * as React from "react";
import input from "./input";
import glamorous from "glamorous";
import paper from "components/Paper";

export default context => {
  const { tr } = context;
  const Paper = paper(context);
  const InputEmpty = input(context);
  const InputWithValue = input(context);
  const InputDisabled = input(context);
  const InputExamplesView = glamorous(Paper)({
  });
  const ListView = glamorous("div")({
    "> div": {
      marginBottom: 30
    }
  });
  return function InputExamples() {
    return (
      <InputExamplesView>
        <h3>{tr.t("Input")}</h3>
        <ListView>
          <InputEmpty label={tr.t("Input Text Empty")} />
          <InputWithValue
            defaultValue="something"
            label={tr.t("Input with value")}
          />
          <InputDisabled
            disabled
            defaultValue="disabled"
            label={tr.t("Input disabled")}
          />
        </ListView>
      </InputExamplesView>
    );
  };
};
