import React from "react";
import glamorous from "glamorous";

export default ({ theme }) => {
  const { palette } = theme;

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
    padding: 12,
    ":hover": {
      backgroundColor: palette.accent2Color
    }
  });

  const A = glamorous("a")({
    textDecoration: "none",
    fontWeight: "bold",
    color: palette.textColor
  });

  function MenuItem({ menu, navChange }) {
    return (
      <MenuItemView>
        <A onClick={() => navChange(menu)} href={menu.route}>{menu.text}</A>
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
