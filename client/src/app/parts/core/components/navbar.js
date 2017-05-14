import React from 'react';
import glamorous from 'glamorous';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import config from 'config';
import { browserHistory } from 'react-router';
import mobx from 'mobx';
import { observer } from 'mobx-react';

function navLinks(authenticated) {
  if (authenticated) {
    return [
      {
        route: '/admin/users',
        text: 'ADMIN',
      },
      {
        route: '/db/schema',
        text: 'DB SCHEMA',
      },
      {
        route: '/app/profile',
        text: 'PROFILE',
      },
      {
        route: '/logout',
        text: 'LOGOUT',
      },
    ];
  }
  return [
    {
      route: '/login',
      text: 'LOGIN',
    },
    {
      route: '/register',
      text: 'REGISTER',
    },
    {
      route: '/theme/view',
      text: 'THEME',
    },
  ];
}

export default context => {
  const { tr, theme } = context;

  const store = mobx.observable({
    open: false,
    toggle: mobx.action(function() {
      this.open = !this.open;
    }),
    navChange: mobx.action(function(menuItem) {
      browserHistory.push(menuItem.route);
      this.open = false;
    }),
  });

  function Menu({ authenticated, navChange }) {
    return (
      <div>
        {navLinks(authenticated).map((menu, key) => (
          <MenuItem key={key} onTouchTap={() => navChange(menu)}>
            {menu.text}
          </MenuItem>
        ))}
      </div>
    );
  }

  const ButtonLeftView = glamorous('button')({
    margin: 10,
    background: 'transparent',
    border: 0,
  });

  function BurgerIcon() {
    return (
      <svg id="burger-icon" version="1.1" viewBox="0 0 32 32" width="40px" height="50px">
        <path
          fill={theme.palette.alternateTextColor}
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
        />
      </svg>
    );
  }

  function IconLeft({onLeftIconButtonTouchTap}) {
    return (
      <ButtonLeftView onClick={onLeftIconButtonTouchTap}>
        <BurgerIcon />
      </ButtonLeftView>
    );
  }

  const TitleView = glamorous('div')({
    fontSize: 34,
    fontWeight: 'bold',
    margin: 10,
  });

  const AppBarView = glamorous('div')({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }, (props, theme) => ({
    backgroundColor: theme.palette.primary1Color,
    color: theme.palette.alternateTextColor
  }));

  function AppBar({ onLeftIconButtonTouchTap }) {
    return (
      <AppBarView>
        <IconLeft onLeftIconButtonTouchTap={onLeftIconButtonTouchTap} />
        <TitleView>{tr.t(config.title)}</TitleView>
      </AppBarView>
    );
  }
  function NavBar({ authenticated }) {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={() => {
            store.toggle();
          }}
        />
        <LeftNav
          id="left-nav"
          docked={false}
          open={store.open}
          onRequestChange={open => {
            store.open = open;
          }}
        >
          <Menu authenticated={authenticated} navChange={item => store.navChange(item)} />
        </LeftNav>
      </div>
    );
  }

  return observer(NavBar);
};
