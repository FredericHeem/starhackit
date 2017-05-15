import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import glamorous from "glamorous";

export default ({ theme }) => {
  const { palette } = theme;
  const store = observable({
    focus: false
  });

  const styles = {
    root: {
      margin: "auto",
      padding: 0,
      width: 200,
      position: "relative"
    },
    label: {
      root: {
        fontSize: 14,
        position: "relative",
        color: palette.secondaryTextColor
      },
      focus: {
        color: palette.primary1Color
      }
    },
    input: {
      position: "relative",
      margin: 0,
      paddingBottom: 4,
      paddingTop: 4,
      outline: "none",
      width: "100%",
      border: "none",
      fontSize: 16
      //color: palette.textColor,
    },
    underline: {
      root: {
        position: "absolute",
        width: "100%",
        margin: 0,
        transition: "all 0.5s ease-in-out",
        border: `1px solid ${palette.borderColor}`
      },
      focusOff: {
        backgroundColor: palette.primary1Color,
        transform: "scaleX(0)",
        padding: 2
      },
      focusOn: {
        transform: "scaleX(1)"
      },
      disabled: {
        border: `1px dotted ${palette.borderColor}`
      }
    }
  };
  const InputContainerView = glamorous("div")(styles.root);
  const InputView = glamorous("input")(styles.input);
  const UnderlineView = glamorous("hr")(styles.underline.root);
  const UnderlineFocusView = glamorous(UnderlineView)(
    styles.underline.focusOff
  );

  function Underline({ disabled }) {
    return <UnderlineView css={disabled && styles.underline.disabled} />;
  }
  function UnderlineFocus({ focus }) {
    return <UnderlineFocusView css={focus && styles.underline.focusOn} />;
  }

  const LabelView = glamorous("label")(styles.label.root);

  function Label({ label, id, focus }) {
    return (
      <LabelView htmlFor={id} css={focus && styles.label.focus}>
        {label}
      </LabelView>
    );
  }
  return observer(function Input(props) {
    const { id, label, onChange, ...otherProps } = props;
    return (
      <InputContainerView>
        {label && <Label focus={store.focus} id={id} label={label} />}
        <InputView
          id={id}
          onChange={onChange}
          onBlur={() => {
            store.focus = false;
          }}
          onFocus={() => {
            store.focus = true;
          }}
          {...otherProps}
        />
        <Underline disabled={otherProps.disabled} />
        <UnderlineFocus focus={store.focus} />
      </InputContainerView>
    );
  });
};
