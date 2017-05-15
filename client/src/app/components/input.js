import React from "react";
import glamorous from "glamorous";

export default ({ theme }) => {
  const { palette } = theme;
  const InputContainerView = glamorous("div")({
    padding: 8
  });
  const InputView = glamorous("input")({
    padding: 8
  });

  const UnderlineView = glamorous("input")({
    padding: 8,
    backgroundColor: 'red'
  });


  return function Input(props) {
    const { id, label, onChange, ...otherProps } = props;
    return (
      <InputContainerView>
        <label htmlFor={id}>{label}</label>
        <InputView id={id} onChange={onChange} {...otherProps} />
        <UnderlineView />
      </InputContainerView>
    );
  };
};
