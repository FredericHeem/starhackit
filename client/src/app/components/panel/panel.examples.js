import * as React from "react";
import paper from "components/Paper";
import panel from "./panel";

export default context => {
  const { tr } = context;
  const Paper = paper(context);
  const Panel = panel(context);
  return function PanelExamples() {
    return (
      <Paper>
        <h3>{tr.t("Panel")}</h3>

        <Panel.Panel>
          <Panel.Header>{tr.t("Panel Header")}</Panel.Header>
          <Panel.Body>
            {tr.t("Panel Body")}
          </Panel.Body>
        </Panel.Panel>
      </Paper>
    );
  };
};
