import React from "react";
import styled from "@emotion/styled";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import menu from "./menu";

const  MENU = [
  {
    route: "settings",
    text: "SETTINGS"
  }
];

export default context => {
  const { parts, history } = context;
  const me = parts.auth.stores().me.data;
  const Menu = menu(context);

  const store = observable({
    userMenuOpen: false,
    toggleUserMenu() {
      store.userMenuOpen = !store.userMenuOpen;
    },
    navChange: action(function(menuItem) {
      history.push(menuItem.route);
    })
  });

  const CurrentUser = styled("div")(() => ({
    marginLeft: "auto",
    marginRight: 10
  }));

  const userMenu = () => MENU;

  const UserInfo = observer(() => (
    <div>
      <span onClick={() => store.toggleUserMenu()} style={{ marginRight: 10 }}>{me.get("email")} </span>
      {store.userMenuOpen && (
        <Menu
          css={{ position: "absolute", backgroundColor: "#e6f7ff" }}
          menuItems={userMenu()}
          navChange={item => store.navChange(item)}
        />
      )}
    </div>
  ));

  return () => <CurrentUser>{me && me.get("email") && <UserInfo />}</CurrentUser>;
};
