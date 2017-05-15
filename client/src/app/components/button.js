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
  });
  const FlatButton = glamorous(ButtonView)({
    border: `0px solid ${palette.borderColor}`,
  });
  const RaisedButton = glamorous(ButtonView)({
    border: `1px solid ${palette.borderColor}`,
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
  });
  const A = glamorous('a')({
    textDecoration: 'none',
    fontWeight: 'bold',
    color: palette.textColor,
    display: 'inline-flex',
    alignItems: 'center',
  });

  const LabelView = glamorous('span')({});
  const IconView = glamorous('span')({
    padding: 0,
  });

  function Button(props) {
    const { flat, onClick, label, href, icon, css } = props;
    const TheButton = flat ? FlatButton : RaisedButton
    if (href) {
      return (
        <TheButton css={css}>
          <A href={href}>
            {icon ? <IconView>{icon}</IconView> : null}<LabelView>{label}</LabelView>
          </A>
        </TheButton>
      );
    }
    return (
      <TheButton onClick={onClick}>
        {icon ? <IconView>{icon}</IconView> : null} <LabelView>{label}</LabelView>
      </TheButton>
    );
  }
  return Button;
};
