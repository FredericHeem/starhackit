import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import glamorous from 'glamorous';
import { keyframes } from 'glamor';

export default ({ theme }) => {
  const { palette } = theme;
  const store = observable({
    focus: false,
  });

  const animation = keyframes({
    '0%': { transform: 'scale(0)', opacity: 0 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  });

  const styles = {
    root: {
      margin: 'auto',
      width: '256',
      padding: 0,
      position: 'relative',
    },
    label: {
      root: {
        fontSize: '0.9rem',
        position: 'relative',
        color: palette.textSecondary,
        transition: 'color 1s',
      },
      focus: {
        color: palette.primary,
      },
    },
    input: {
      position: 'relative',
      margin: 0,
      paddingBottom: 4,
      paddingTop: 4,
      outline: 'none',
      width: '100%',
      border: 'none',
      fontSize: '1.2rem',
      //color: palette.textColor,
    },
    underline: {
      root: {
        position: 'absolute',
        width: '100%',
        margin: 0,
        transition: 'all 0.5s ease-in-out',
        border: `1px solid`,
        transform: 'scaleX(0)',
      },
      static: {
        borderColor: palette.borderColor,
        animation: `${animation} 1s`,
        transform: 'scaleX(1)',
      },
      focusOff: {
        borderColor: palette.primary,
      },
      errorOff: {
        borderColor: 'red',
      },
      show: {
        transform: 'scaleX(1)',
      },
      disabled: {
        border: `1px dotted ${palette.borderColor}`,
      },
    },
    error: {
      paddingTop: 6,
      color: 'red',
    },
  };
  const InputContainerView = glamorous('div')(styles.root);
  const LabelView = glamorous('label')(styles.label.root);
  const InputView = glamorous('input')(styles.input);
  const UnderlineView = glamorous('hr')(styles.underline.root);
  const UnderlineStaticView = glamorous(UnderlineView)(styles.underline.static);
  const UnderlineFocusView = glamorous(UnderlineView)(
    styles.underline.focusOff,
  );
  const UnderlineErrorView = glamorous(UnderlineView)(
    styles.underline.errorOff,
  );
  const ErrorView = glamorous('div')(styles.error);

  return observer(function Input(props) {
    const { id, label, onChange, error, ...otherProps } = props;
    return (
      <InputContainerView>
        {label &&
          <LabelView htmlFor={id} css={store.focus && styles.label.focus}>
            {label}
          </LabelView>}
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
        <UnderlineStaticView
          css={otherProps.disabled && styles.underline.disabled}
        />
        <UnderlineFocusView css={store.focus && styles.underline.show} />
        <UnderlineErrorView css={error && styles.underline.show} />
        {error &&
          <ErrorView>
            {error}
          </ErrorView>}
      </InputContainerView>
    );
  });
};
