import React from "react";
import button from "mdlean/lib/button";
/* eslint-disable jsx-extras/jsx-no-string-literals */
export default context => {
  const Button = button(context);

  return function buttonExamples() {
    return (
      <div>
        <h3>Flat</h3>
        <p>
          <Button label="FLAT LABEL" />
          <Button primary>FLAT PRIMARY</Button>
          <Button accent>FLAT ACCENT</Button>
          <Button ripple label="RIPPLE FLAT" />
          <Button disabled label="disabled FLAT LABEL" />
        </p>
        <h3>Raised</h3>
        <p>
          <Button raised label="RAISED FLAT" />
          <Button raised primary>RAISED PRIMARY</Button>
          <Button raised accent>RAISED ACCENT</Button>
          <Button raised ripple label="RAISED RIPPLE" />
          <Button raised accent disabled>disabled RAISED ACCENT </Button>
        </p>
        <h3>Primary</h3>
        <p>
          <Button primary>PRIMARY</Button>
          <Button primary raised>PRIMARY RAISED</Button>
          <Button primary ripple raised>primary RIPPLE RAISED</Button>
          <Button primary disabled>
            primary disabled
          </Button>
        </p>
      </div>
    );
  };
};
