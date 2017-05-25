import React from 'react';
import glamorous from 'glamorous';

export default ({ theme }) => {
  const { palette } = theme;
  const DrawerView = glamorous('div')({
    zIndex: 2,
    position: 'absolute',
    border: `1px solid ${palette.borderColor}`,
    backgroundColor: `${palette.background}`,
    top: 0,
    left: 0,
    height: '100%',
    transition: 'transform 0.5s ease-in-out',
  });

  const DrawerOverlayView = glamorous('div')({
    zIndex: -1,
    position: 'absolute',
    backgroundColor: `${palette.background}`,
    opacity: 0,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    transition: 'opacity 0.5s ease-in-out',
  });

  function Drawer({ store, open, children }) {
    const tx = open ? 0 : -window.innerWidth;
    const opacity = open ? 0.5 : 0;
    const zIndex = open ? 1 : -1;
    return (
      <div>
        <DrawerOverlayView
          onClick={() => {store.open = false}}
          css={{ zIndex, opacity: `${opacity}` }}
        />
        <DrawerView css={{ transform: `translate(${tx}px, 0px)` }}>
          {children}
        </DrawerView>
      </div>
    );
  }
  return Drawer;
};
