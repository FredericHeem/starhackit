import React from "react";
import glamorous from "glamorous";
import button from 'mdlean/lib/button';

export default (context) => {
  //const {theme} = context
  //const { palette } = theme;

  function menus(authenticated) {
    if (authenticated) {
      return [
        {
          route: "/admin/users",
          text: "ADMIN"
        },
        {
          route: "/db/schema",
          text: "DB SCHEMA"
        },
        {
          route: "/app/profile",
          text: "PROFILE"
        },
        {
          route: "/logout",
          text: "LOGOUT"
        }
      ];
    }
    return [
      {
        route: "/login",
        text: "LOGIN"
      },
      {
        route: "/register",
        text: "REGISTER"
      },
      {
        route: "/theme/view",
        text: "THEME"
      }
    ];
  }

  const MenuItemView = glamorous("div")({
    width: '100%',
    minWidth: 150
  });

  function MenuItem({ menu, navChange }) {
    const Button = button(context);
    return (
      <MenuItemView>
        <Button style={{width:'100%', textAlign: 'start'}} flat label={menu.text} onClick={() => navChange(menu)} />
      </MenuItemView>
    );
  }

  const MenuView = glamorous("div")({
    padding: 0
  });

  function Menu({ authenticated, navChange }) {
    return (
      <MenuView>
        {menus(authenticated).map((menu, key) => (
          <MenuItem navChange={navChange} menu={menu} key={key} />
        ))}
      </MenuView>
    );
  }
  return Menu;
};
