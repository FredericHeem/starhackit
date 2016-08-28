import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import config from 'config';
import {browserHistory} from 'react-router';
import mobx from 'mobx';
import {observer} from 'mobx-react';

function navLinks(authenticated) {
  if (authenticated) {
    return [
      {
        route: '/admin/users',
        text: 'ADMIN'
      }, {
        route: '/db/schema',
        text: 'DB SCHEMA'
      }, {
        route: '/app/profile',
        text: 'PROFILE'
      }, {
        route: '/logout',
        text: 'LOGOUT'
      }
    ];
  } else {
    return [
      {
        route: '/login',
        text: 'LOGIN'
      }, {
        route: '/register',
        text: 'REGISTER'
      }
    ];
  }
}

export default () => {

  const store = mobx.observable({
    open: false,
    toggle: mobx.action(function() {
      this.open = !this.open;
    }),
    navChange: mobx.action(function(menuItem) {
      browserHistory.push(menuItem.route)
      this.open = false;
    })
  })

  function Menu(props){
      return (
        <div>
          {navLinks(props.authenticated).map((menu, key) => (
              <MenuItem key={key} onTouchTap={() => props.navChange(menu)}>
                {menu.text}
              </MenuItem>
          ))}
        </div>
      )
  }

  Menu.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    navChange: PropTypes.func.isRequired,
  }

  function NavBar({authenticated}){
      return (
        <div >
          <AppBar style={{}} id='app-bar' title={config.title} onLeftIconButtonTouchTap={() => {store.toggle()}}/>
          <LeftNav id='left-nav' docked={false} open={store.open} onRequestChange={open => {store.open = open}}>
            <Menu authenticated={authenticated} navChange={(item) => store.navChange(item)}/>
          </LeftNav>
        </div>
      );
  }

  NavBar.propTypes = {
    authenticated: PropTypes.bool.isRequired
  }
  return observer(NavBar);
}
