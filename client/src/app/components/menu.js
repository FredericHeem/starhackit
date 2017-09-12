import * as React from "react";
import glamorous from "glamorous";
import button from "mdlean/lib/button";

export default context => {
  const { tr } = context;
  //const { palette } = theme;

  function menus(authenticated) {
    if (authenticated) {
      return [
        {
          route: "/users",
          text: "ADMIN"
        },
        {
          route: "/dbschema",
          text: "DB SCHEMA"
        },
        {
          route: "/profile",
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
      }
    ];
  }

  const menuCommon = [
    {
      route: "/guide",
      text: "COMPONENT GUIDE"
    }
  ];

  const MenuItemView = glamorous("div")({
    width: "100%",
    minWidth: 150
  });

  function MenuItem({ menu, navChange }) {
    const Button = button(context);
    return (
      <MenuItemView>
        <Button
          style={{ width: "100%", textAlign: "start" }}
          label={menu.text}
          onClick={() => navChange(menu)}
        />
      </MenuItemView>
    );
  }

  const MenuView = glamorous("div")({
    padding: 0
  });

  function Menu({ authenticated, themeSideBar, navChange }) {
    const Button = button(context);
    return (
      <MenuView>
        {menus(authenticated)
          .concat(menuCommon)
          .map((menu, key) => (
            <MenuItem navChange={navChange} menu={menu} key={key} />
          ))}
        <Button
          style={{ width: "100%", textAlign: "start" }}
          label={tr.t("THEME")}
          onClick={() => themeSideBar()}
        />
      </MenuView>
    );
  }
  return Menu;
};
