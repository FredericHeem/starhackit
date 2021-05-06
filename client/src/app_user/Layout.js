import React, { createElement as h } from "react";
import { observer } from "mobx-react";
import footer from "./footer";
import MainView from "components/MainView";
import navBar from "components/navbar";
import userInfo from "components/UserInfo";

import APP_MENU from "./menuItems";

export default (context) => {
  const {
    alertStack: { View: AlertStack },
  } = context;

  const NavBar = navBar(context);
  const Footer = footer(context);
  const UserInfo = userInfo(context);

  const Layout = ({ children }) => (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        minWidth: "100vw",
        flexDirection: "column",
      }}
    >
      <NavBar appMenu={APP_MENU()} right={UserInfo} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexGrow: "1",
        }}
      >
        <MainView>{children}</MainView>
      </div>
      <AlertStack />
    </div>
  );

  return ({ children }) =>
    h(observer(Layout), {
      children,
    });
};
