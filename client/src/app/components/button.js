import React from 'react';
import glamorous from 'glamorous';

export default ({ theme }) => {
  const { palette } = theme;
  const ButtonView = glamorous('button')({
    padding: 8,
    backgroundColor: palette.canvasColor,

    cursor: 'pointer',
    ':hover': {
      backgroundColor: palette.accent2Color,
    },
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 14,
    textTransform: 'uppercase'
  });
  const FlatButton = glamorous(ButtonView)({
    border: `0px solid ${palette.borderColor}`,
  });
  const RaisedButton = glamorous(ButtonView)({
    border: `1px solid ${palette.borderColor}`,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 6px, rgba(0, 0, 0, 0.1) 0px 1px 4px',
  });
  const A = glamorous('a')({
    textDecoration: 'none',
    color: palette.textColor,
    display: 'inline-flex',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%'
  });

  const LabelView = glamorous('span')({
    width: '100%'
  });
  const IconView = glamorous('span')({
    padding: 0,
  });

  function Button(props) {
    const { flat, label, href, icon, ...otherProps } = props;
    const TheButton = flat ? FlatButton : RaisedButton
    if (href) {
      return (
        <TheButton {...otherProps}>
          <A href={href}>
            {icon ? <IconView>{icon}</IconView> : null}<LabelView>{label}</LabelView>
          </A>
        </TheButton>
      );
    }
    return (
      <TheButton {...otherProps}>
        {icon ? <IconView>{icon}</IconView> : null} <LabelView>{label}</LabelView>
      </TheButton>
    );
  }
  return Button;
};
