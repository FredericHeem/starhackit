import React from 'react';
import glamorous from 'glamorous';

const ripple = {
  position: 'relative',
  overflow: 'hidden',
  transform: 'translate3d(0, 0, 0)',
  ':after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle, #000 10%, transparent 10%)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    transform: 'scale(10,10)',
    opacity: 0,
    transition: 'transform .5s, opacity 1s',
  },
  ':active:after': {
    transform: 'scale(0,0)',
    opacity: 0.2,
    transition: '0s',
    backgroundColor: 'red',
  },
};

export default ({ theme }) => {
  const { palette } = theme;
  const styles = {
    root: {
      padding: '0.5rem',
      backgroundColor: palette.canvasColor,
      display: 'inline-flex',
      alignItems: 'center',
      textTransform: 'uppercase',
      textAlign: 'center',
      transition: 'background-color 0.3s',
      outline: 'none',
      ':hover': {
        backgroundColor: palette.accent2Color,
      },
      color: palette.textColor,
    },
    button: {
      cursor: 'pointer',
    },
    a: {
      textDecoration: 'none',
      boxSizing: 'border-box',
    },
    flat: {
      borderWidth: 0,
    },
    raised: {
      border: `1px solid ${palette.borderColor}`,
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 6px, rgba(0, 0, 0, 0.1) 0px 1px 4px',
    },
    label: {
      width: '100%',
    },
    icon: {
      padding: '0.4rem',
    },
  };
  const ButtonView = glamorous('button')(styles.root, styles.button);
  const AnchorView = glamorous('a')(styles.root, styles.a);
  const LabelView = glamorous('span')(styles.label);
  const IconView = glamorous('span')(styles.icon);

  return function Button(props) {
    const { flat, label, href, icon, ...otherProps } = props;
    const TheButton = glamorous(href ? AnchorView : ButtonView)(
      flat ? styles.flat : styles.raised,
      ripple,
    );

    return (
      <TheButton href={href} {...otherProps}>
        {icon ? <IconView>{icon}</IconView> : null}
        <LabelView>{label}</LabelView>
      </TheButton>
    );
  };
};
