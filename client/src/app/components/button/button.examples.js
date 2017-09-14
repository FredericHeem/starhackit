import * as React from "react";
import glamorous from "glamorous";
import button from "mdlean/lib/button";
import paper from "components/Paper";
/* eslint-disable jsx-extras/jsx-no-string-literals */
export default context => {
  const Button = button(context);
  const Paper = paper(context);
  const ButtonExamplesView = glamorous(Paper)({
    maxWidth: 500,
  });

  const ButtonGroupView = glamorous("div")({
    "> button": {
      margin: 6
    }
  });

  return function buttonExamples() {
    return (
      <ButtonExamplesView>
        <h3>Flat</h3>
        <ButtonGroupView>
          <Button label="FLAT LABEL" />
          <Button primary>FLAT PRIMARY</Button>
          <Button accent>FLAT ACCENT</Button>
          <Button ripple label="RIPPLE FLAT" />
          <Button disabled label="disabled FLAT LABEL" />
        </ButtonGroupView>
        <h3>Raised</h3>
        <ButtonGroupView>
          <Button raised label="RAISED FLAT" />
          <Button raised primary>RAISED PRIMARY</Button>
          <Button raised accent>RAISED ACCENT</Button>
          <Button raised ripple label="RAISED RIPPLE" />
          <Button raised accent disabled>disabled RAISED ACCENT </Button>
        </ButtonGroupView>
        <h3>Primary</h3>
        <ButtonGroupView>
          <Button primary>PRIMARY</Button>
          <Button primary raised>PRIMARY RAISED</Button>
          <Button primary ripple raised>primary RIPPLE RAISED</Button>
          <Button primary disabled>
            primary disabled
          </Button>
        </ButtonGroupView>
      </ButtonExamplesView>
    );
  };
};
